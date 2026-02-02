import fs from 'fs';
import path from 'path';

export interface NotasENEM {
  linguagens?: string | null;
  humanas?: string | null;
  natureza?: string | null;
  matematica?: string | null;
  redacao?: string | null;
}

export interface ResultadoBusca {
  success: boolean;
  totalLines: number;
  matchCount: number;
  outputPath: string | null;
  logs: string[];
}

export class BuscadorENEM {
  private logs: string[] = [];

  log(message: string): void {
    this.logs.push(message);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogs(): string[] {
    return this.logs;
  }

  formatNotaFromOCR(notaStr: string | null): string | null {
    if (!notaStr) return null;

    notaStr = notaStr.trim();

    if (notaStr.includes('.') || notaStr.includes(',')) {
      return notaStr.replace(',', '.');
    }

    if (/^\d{4}$/.test(notaStr)) {
      return notaStr.slice(0, 3) + '.' + notaStr.slice(3);
    }

    if (/^\d{3}$/.test(notaStr)) {
      return notaStr + '.0';
    }

    return notaStr;
  }

  extractNome(text: string): string {
    const patterns = [
      /nome[:\s]+([A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ][A-Za-záàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+)/i,
      /candidato[:\s]+([A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ][A-Za-záàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+)/i,
      /aluno[:\s]+([A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ][A-Za-záàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+)/i,
      /participante[:\s]+([A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ][A-Za-záàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let nome = match[1].trim();
        nome = nome.replace(/\b(cpf|inscri|data|nascimento|de nascimento)\b.*/i, '').trim();
        if (nome.length > 3) {
          return nome;
        }
      }
    }
    return '';
  }

  extractCPF(text: string): string {
    const patterns = [
      /cpf[:\s]*(\d{3}\.?\d{3}\.?\d{3}[-.]?\d{2})/i,
      /(\d{3}\.\d{3}\.\d{3}[-]\d{2})/,
      /(\d{11})/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const cpfDigits = match[1].replace(/\D/g, '');
        if (cpfDigits.length === 11) {
          return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6, 9)}-${cpfDigits.slice(9)}`;
        }
      }
    }
    return '';
  }

  extractNotas(text: string): NotasENEM {
    const notas: NotasENEM = {};

    const patternsLinguagens = [
      /linguagens[,\s]+c[oó]digos[^0-9]*?(\d{2,3}[.,]\d)/i,
      /linguagens[^0-9]*?(\d{2,3}[.,]\d)/i,
      /lc\s*[:\-]?\s*(\d{2,3}[.,]\d)/i,
      /linguagens[,\s]+c[oó]digos[^0-9]*?(\d{4})\b/i,
      /linguagens[^0-9]*?(\d{4})\b/i,
      /lc\s*[:\-]?\s*(\d{4})\b/i,
      /linguagens[,\s]+c[oó]digos[^0-9]*?(\d{3})\b/i,
      /linguagens[^0-9]*?(\d{3})\b/i,
      /lc\s*[:\-]?\s*(\d{3})\b/i,
    ];

    const patternsHumanas = [
      /ci[eê]ncias\s+humanas[^0-9]*?(\d{2,3}[.,]\d)/i,
      /humanas[^0-9]*?(\d{2,3}[.,]\d)/i,
      /ch\s*[:\-]?\s*(\d{2,3}[.,]\d)/i,
      /ci[eê]ncias\s+humanas[^0-9]*?(\d{4})\b/i,
      /humanas[^0-9]*?(\d{4})\b/i,
      /ch\s*[:\-]?\s*(\d{4})\b/i,
      /ci[eê]ncias\s+humanas[^0-9]*?(\d{3})\b/i,
      /humanas[^0-9]*?(\d{3})\b/i,
      /ch\s*[:\-]?\s*(\d{3})\b/i,
    ];

    const patternsNatureza = [
      /ci[eê]ncias?\s+d[ae]\s*natureza[s]?[^0-9]*?(\d{2,3}[.,]\d)/i,
      /natureza[s]?[^0-9]*?(\d{2,3}[.,]\d)/i,
      /cn\s*[:\-]?\s*(\d{2,3}[.,]\d)/i,
      /ci[eê]ncias?\s+d[ae]\s*natureza[s]?[^0-9]*?(\d{4})\b/i,
      /natureza[s]?[^0-9]*?(\d{4})\b/i,
      /cn\s*[:\-]?\s*(\d{4})\b/i,
      /ci[eê]ncias?\s+d[ae]\s*natureza[s]?[^0-9]*?(\d{3})\b/i,
      /natureza[s]?[^0-9]*?(\d{3})\b/i,
      /cn\s*[:\-]?\s*(\d{3})\b/i,
    ];

    const patternsMatematica = [
      /matem[aá]tica[^0-9]*?(\d{2,3}[.,]\d)/i,
      /mt\s*[:\-]?\s*(\d{2,3}[.,]\d)/i,
      /matem[aá]tica[^0-9]*?(\d{4})\b/i,
      /mt\s*[:\-]?\s*(\d{4})\b/i,
      /matem[aá]tica[^0-9]*?(\d{3})\b/i,
      /mt\s*[:\-]?\s*(\d{3})\b/i,
    ];

    const patternsRedacao = [
      /reda[cç][aã]o[^0-9]*?(\d{2,3}[.,]\d)/i,
      /red\s*[:\-]?\s*(\d{2,3}[.,]\d)/i,
      /reda[cç][aã]o[^0-9]*?(\d{4})\b/i,
      /red\s*[:\-]?\s*(\d{4})\b/i,
      /reda[cç][aã]o[^0-9]*?(\d{3})\b/i,
      /red\s*[:\-]?\s*(\d{3})\b/i,
    ];

    for (const pattern of patternsLinguagens) {
      const match = text.match(pattern);
      if (match) {
        notas.linguagens = this.formatNotaFromOCR(match[1]);
        break;
      }
    }

    for (const pattern of patternsHumanas) {
      const match = text.match(pattern);
      if (match) {
        notas.humanas = this.formatNotaFromOCR(match[1]);
        break;
      }
    }

    for (const pattern of patternsNatureza) {
      const match = text.match(pattern);
      if (match) {
        notas.natureza = this.formatNotaFromOCR(match[1]);
        break;
      }
    }

    for (const pattern of patternsMatematica) {
      const match = text.match(pattern);
      if (match) {
        notas.matematica = this.formatNotaFromOCR(match[1]);
        break;
      }
    }

    for (const pattern of patternsRedacao) {
      const match = text.match(pattern);
      if (match) {
        notas.redacao = this.formatNotaFromOCR(match[1]);
        break;
      }
    }

    return notas;
  }

  normalizeValue(value: string | null | undefined): number | null {
    if (!value) return null;
    try {
      const normalized = String(value).trim().replace(',', '.');
      const num = parseFloat(normalized);
      if (isNaN(num)) return null;
      return Math.round(num * 10) / 10;
    } catch {
      return null;
    }
  }

  findColumnIndices(headerLower: string[]): Record<string, number | null> {
    const indices: Record<string, number | null> = {
      linguagens: null,
      humanas: null,
      natureza: null,
      matematica: null,
      redacao: null,
    };

    for (let idx = 0; idx < headerLower.length; idx++) {
      const col = headerLower[idx];

      // Linguagens, códigos e suas variantes em microdados e resultados oficiais
      if (
        col.includes('linguagen') ||
        (col.includes('lc') && col.includes('tecnolog')) ||
        col.includes('nu_nota_lc')
      ) {
        indices.linguagens = idx;
      // Ciências Humanas
      } else if (
        col.includes('humanas') ||
        (col.includes('ch') && col.includes('tecnolog')) ||
        col.includes('nu_nota_ch')
      ) {
        indices.humanas = idx;
      // Ciências da Natureza
      } else if (
        col.includes('natureza') ||
        (col.includes('cn') && col.includes('tecnolog')) ||
        col.includes('nu_nota_cn')
      ) {
        indices.natureza = idx;
      // Matemática
      } else if (
        col.includes('matem') ||
        (col.includes('mt') && col.includes('tecnolog')) ||
        col.includes('nu_nota_mt')
      ) {
        indices.matematica = idx;
      // Redação
      } else if (col.includes('redac') || col.includes('nu_nota_redacao')) {
        indices.redacao = idx;
      }
    }
    console.log('Índices das colunas encontradas:', indices);
    return indices;
  }

  rowMatches(
    row: string[],
    colIndices: Record<string, number | null>,
    notasBusca: Record<string, number | null>
  ): boolean {
    let matches = 0;
    const expectedMatches = Object.values(notasBusca).filter(v => v !== null).length;

    if (expectedMatches === 0) return false;

    if (Object.values(colIndices).some(v => v !== null)) {
      for (const [key, idx] of Object.entries(colIndices)) {
        if (idx !== null && notasBusca[key] !== null) {
          if (idx < row.length) {
            const rowValue = this.normalizeValue(row[idx]);
            if (rowValue !== null && rowValue === notasBusca[key]) {
              matches++;
            }
          }
        }
      }
    } else {
      for (const cell of row) {
        const cellValue = this.normalizeValue(cell);
        if (cellValue !== null) {
          for (const nota of Object.values(notasBusca)) {
            if (nota !== null && cellValue === nota) {
              matches++;
              break;
            }
          }
        }
      }
    }

    return matches === expectedMatches;
  }

  async searchCSV(
    csvPath: string,
    notasBusca: NotasENEM,
    nomeAluno: string,
    cpfAluno: string,
    outputPath: string
  ): Promise<ResultadoBusca> {
    this.clearLogs();

    console.log('========================================');
    console.log('Iniciando busca no CSV...');
    console.log('========================================');
    console.log(`Buscando notas:`);
    console.log(`  Linguagens: ${notasBusca.linguagens || 'N/A'}`);
    console.log(`  Humanas: ${notasBusca.humanas || 'N/A'}`);
    console.log(`  Natureza: ${notasBusca.natureza || 'N/A'}`);
    console.log(`  Matemática: ${notasBusca.matematica || 'N/A'}`);

    const notasNormalizadas: Record<string, number | null> = {
      linguagens: this.normalizeValue(notasBusca.linguagens),
      humanas: this.normalizeValue(notasBusca.humanas),
      natureza: this.normalizeValue(notasBusca.natureza),
      matematica: this.normalizeValue(notasBusca.matematica),
      redacao: this.normalizeValue(notasBusca.redacao),
    };

    const resultados: string[][] = [];
    let header: string[] = [];
    let totalLinhas = 0;

    try {
      const fileContent = fs.readFileSync(csvPath, 'utf-8');
      const sample = fileContent.slice(0, 2048);

      const delimiter = sample.split(';').length > sample.split(',').length ? ';' : ',';

      const lines = fileContent.split(/\r?\n/);

      header = lines[0].split(delimiter).map(col => col.trim());
      const headerLower = header.map(col => col.toLowerCase());

      console.log(`\nColunas encontradas: ${header.length} colunas`);
      console.log(`Delimitador: '${delimiter}'`);

      const colIndices = this.findColumnIndices(headerLower);
        
      if (!Object.values(colIndices).some(v => v !== null)) {
        console.log('⚠️ Nenhuma coluna de nota reconhecida no CSV.');
        console.log('Procurando por valores nas colunas...');
      }

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        totalLinhas++;
        const row = line.split(delimiter).map(cell => cell.trim());

        if (this.rowMatches(row, colIndices, notasNormalizadas)) {
          resultados.push(row);
          console.log(`✓ Linha ${i + 1} corresponde!`);
        }

        if (totalLinhas % 100000 === 0) {
          console.log(`Processando... ${totalLinhas.toLocaleString()} linhas`);
        }
      }

      console.log(`\nTotal de linhas processadas: ${totalLinhas.toLocaleString()}`);
      console.log(`Correspondências encontradas: ${resultados.length}`);

      if (resultados.length > 0 && header.length > 0) {
        const newHeader = ['Aluno', 'CPF', ...header];

        const outputLines = [newHeader.join(';')];
        for (const row of resultados) {
          const newRow = [nomeAluno, cpfAluno, ...row];
          outputLines.push(newRow.join(';'));
        }

        fs.writeFileSync(outputPath, '\ufeff' + outputLines.join('\n'), 'utf-8');
        this.log(`\n✓ Resultados exportados para: ${path.basename(outputPath)}`);
      }

      return {
        success: true,
        totalLines: totalLinhas,
        matchCount: resultados.length,
        outputPath: resultados.length > 0 ? outputPath : null,
        logs: this.getLogs(),
      };
    } catch (error) {
      this.log(`❌ Erro ao processar CSV: ${error}`);
      return {
        success: false,
        totalLines: totalLinhas,
        matchCount: 0,
        outputPath: null,
        logs: this.getLogs(),
      };
    }
  }
}

export const buscadorENEM = new BuscadorENEM();
