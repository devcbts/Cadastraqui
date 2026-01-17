import { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { buscadorENEM } from '@/lib/enem/enem-service';
import { verifyJWT } from '@/http/middlewares/verify-jwt';

const uploadDir = path.join(os.tmpdir(), 'enem-uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function enemRoutes(app: FastifyInstance) {
  app.get('/status', async (_request, reply) => {
    const { spawn } = await import('child_process');

    const checkPython = (): Promise<{ python: boolean; pymupdf: boolean; tesseract: boolean; version?: string }> => {
      return new Promise((resolve) => {
        const pythonCommands = ['python3', 'python', 'py'];
        let currentIndex = 0;

        const checkScript = `\nimport json\nresult = {"python": True, "pymupdf": False, "tesseract": False, "version": ""}\ntry:\n    import fitz\n    result["pymupdf"] = True\n    result["version"] = fitz.version[0]\nexcept: pass\ntry:\n    import pytesseract\n    pytesseract.get_tesseract_version()\n    result["tesseract"] = True\nexcept: pass\nprint(json.dumps(result))\n`;

        const tryPython = (cmd: string) => {
          const pythonProc = spawn(cmd, ['-c', checkScript]);
          let stdout = '';

          pythonProc.stdout.on('data', (data) => {
            stdout += data.toString();
          });

          pythonProc.on('error', () => {
            currentIndex++;
            if (currentIndex < pythonCommands.length) {
              tryPython(pythonCommands[currentIndex]);
            } else {
              resolve({ python: false, pymupdf: false, tesseract: false });
            }
          });

          pythonProc.on('close', (code) => {
            if (code === 0 && stdout) {
              try {
                resolve(JSON.parse(stdout));
              } catch {
                resolve({ python: true, pymupdf: false, tesseract: false });
              }
            } else {
              currentIndex++;
              if (currentIndex < pythonCommands.length) {
                tryPython(pythonCommands[currentIndex]);
              } else {
                resolve({ python: false, pymupdf: false, tesseract: false });
              }
            }
          });
        };

        tryPython(pythonCommands[0]);
      });
    };

    const pythonStatus = await checkPython();

    return reply.send({
      python: { installed: pythonStatus.python },
      pymupdf: {
        installed: pythonStatus.pymupdf,
        version: pythonStatus.version || null,
      },
      tesseract: {
        installed: pythonStatus.tesseract,
      },
    });
  });

  // Upload e extração do PDF na mesma rota, delegando a extração
  // para o microserviço Python enem_pdf_service
  app.post('/extract-pdf', { onRequest: [verifyJWT] }, async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ success: false, error: 'Nenhum arquivo enviado' });
    }

    const buffer = await data.toBuffer();
    const pdfPath = path.join(uploadDir, data.filename || data.fieldname + '-' + Date.now());
    fs.writeFileSync(pdfPath, buffer as unknown as NodeJS.ArrayBufferView);

    buscadorENEM.clearLogs();

    try {
      const serviceUrl = process.env.ENEM_PDF_SERVICE_URL || 'http://localhost:8000';

      const response = await fetch(`${serviceUrl}/extract-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdf_path: pdfPath }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log(`❌ Erro ao chamar microserviço Python: ${text}`);
        return reply.status(500).send({
          success: false,
          error: 'Falha ao comunicar com serviço de extração de PDF',
          logs: buscadorENEM.getLogs(),
        });
      }

      const pythonResult = await response.json() as { success: boolean; text: string; method: string; error: string | null };

      if (!pythonResult.success) {
        return reply.send({
          success: false,
          error: pythonResult.error || 'Não foi possível extrair texto do PDF',
          logs: buscadorENEM.getLogs(),
        });
      }

      const text = pythonResult.text;

      if (pythonResult.method === 'direct') {
        console.log('✓ Texto extraído com sucesso (PDF pesquisável)');
      } else if (pythonResult.method === 'ocr') {
        console.log('✓ Texto extraído com OCR (PyMuPDF + Tesseract)');
      }

      const nome = buscadorENEM.extractNome(text);
      const cpf = buscadorENEM.extractCPF(text);
      const notas = buscadorENEM.extractNotas(text);

      return reply.send({
        success: true,
        data: { nome, cpf, notas },
        textSample: text.slice(0, 1000),
        logs: buscadorENEM.getLogs(),
      });
    } catch (error) {
      console.log(`❌ Erro ao processar PDF: ${error}`);
      return reply.status(500).send({
        success: false,
        error: 'Não foi possível extrair texto do PDF',
        logs: buscadorENEM.getLogs(),
      });
    }
  });

  app.post('/search', { onRequest: [verifyJWT] }, async (request, reply) => {
    const configuredCsvPath = process.env.ENEM_CSV_PATH;
    const defaultCsvPath = configuredCsvPath ?? path.join(uploadDir, 'microdados_enem.csv');

    if (!defaultCsvPath || !fs.existsSync(defaultCsvPath)) {
      return reply.status(500).send({
        success: false,
        error: 'Arquivo CSV de microdados do ENEM não configurado no servidor',
      });
    }

    const body = request.body as any;
    const { notas, nomeAluno, cpfAluno, outputName } = body || {};

    if (!notas || (!notas.linguagens && !notas.humanas && !notas.natureza && !notas.matematica)) {
      return reply.status(400).send({ success: false, error: 'Informe pelo menos uma nota para busca' });
    }

    const finalOutputName = outputName || 'Resultado_Busca_Enem.csv';
    const outputPath = path.join(uploadDir, finalOutputName);

    const result = await buscadorENEM.searchCSV(
      defaultCsvPath,
      notas,
      nomeAluno || '',
      cpfAluno || '',
      outputPath,
    );

    return reply.send({
      success: result.success,
      totalLines: result.totalLines,
      matchCount: result.matchCount,
      outputPath: result.matchCount > 0 ? finalOutputName : null,
      logs: result.logs,
    });
  });
}
