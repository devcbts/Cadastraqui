import { historyDatabase, prisma } from "@/lib/prisma";
import path from "path";
import { downloadFromS3 } from "@/lib/S3";
import * as fs from 'fs';
import { section, toDbSection } from "@/http/controllers/social-assistant/enums/Section";
import { getDocumentsUrls } from "@/utils/assistant/get-documents-urls";
import { extractText, buildIndex, checkFormAgainstDocs } from './rag'
import { EventEmitter } from "stream";
import { PDFDocument } from "pdf-lib";
import { openAi } from "@/lib/openAi";

// Aumentar o limite de listeners para evitar o aviso
EventEmitter.defaultMaxListeners = 20;

// Função para adicionar um atraso
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function initializeThread(application_id: string, sectionToFind: section, member_id: string, table_id: string | null) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: application_id }
        });
        if (!application) throw new Error("Application not found");

        // Buscar campos do formulário
        let fields: { key: string, label: string, value: string, type?: string }[] = [];
        if (sectionToFind === 'income') {
            const income = await historyDatabase.familyMemberIncome.findUniqueOrThrow({
                where: { application_id: application_id, id: table_id! },
                include: { MonthlyIncomes: true }
            });
            // Exemplo: adapte conforme estrutura real
            fields.push({ key: 'renda_liquida', label: 'Renda mensal Líquida', value: income.averageIncome, type: 'currency' });
            
            // Adicione outros campos necessários
        } else if (sectionToFind === 'health') {
            // Adapte para buscar campos de saúde
            // fields.push(...)
        } else {
            // Adapte para outras seções
            // fields.push(...)
        }

        // Buscar URLs dos documentos
        let files;
        if (sectionToFind === 'income') {
            files = await getDocumentsUrls([table_id ? `income/${member_id}/${table_id}` : `income/${member_id}`], application_id);
            const income = await historyDatabase.familyMemberIncome.findUniqueOrThrow({
                where: { application_id: application_id, id: table_id! },
                include: { MonthlyIncomes: true }
            });
            for (const monthlyIncome of income.MonthlyIncomes) {
                files = [...files, ...(await getDocumentsUrls([`monthly-income/${member_id}/${monthlyIncome.id}`], application_id))];
            }
        } else if (sectionToFind === 'health') {
            files = await getDocumentsUrls([`${sectionToFind}/${member_id}`, `medication/${member_id}`], application_id);
        } else {
            files = await getDocumentsUrls([`${sectionToFind}/${member_id}`], application_id);
        }
        if (!files) {
            console.log("Nenhum arquivo encontrado.");
            return;
        }

        // Baixar e extrair texto dos arquivos
        let rawDocs: { id: string, filename: string, text: string }[] = [];
        for (const fileSection of files) {
            for (const [section, sectionContent] of Object.entries(fileSection)) {
                for (const [folder, fileContents] of Object.entries(sectionContent)) {
                    for (const [fileName, url] of Object.entries(fileContents)) {
                        const cleanFileName = fileName.replace(/^url_/, '');
                        const outputPath = path.resolve(__dirname, folder + "_" + cleanFileName);
                        await downloadFromS3(`${folder}/${cleanFileName}`, outputPath);
                        if (!fs.existsSync(outputPath)) {
                            console.error(`Erro: Arquivo não encontrado após download: ${outputPath}`);
                            continue;
                        }
                        try {
                            const text = await extractText(outputPath);
                            rawDocs.push({ id: cleanFileName, filename: outputPath, text });
                        } catch (err) {
                            console.error(`Erro ao extrair texto de ${outputPath}:`, err);
                        }
                        fs.unlinkSync(outputPath);
                    }
                }
            }
        }

        // Indexar documentos
        const index = await buildIndex(rawDocs);

        // Checar consistência dos campos do formulário
        const result = await checkFormAgainstDocs(index, fields);

        // Salvar resultado em arquivo JSON
        fs.writeFileSync('resultado_auditoria.json', JSON.stringify(result, null, 2), 'utf-8');
        console.log('Resultado salvo em resultado_auditoria.json');
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

async function processFile(outputPath: string) {
    // Ler o arquivo PDF original
    const existingPdfBytes = fs.readFileSync(outputPath);

    // Carregar o PDF
    const pdfDoc = await PDFDocument.load(new Uint8Array(existingPdfBytes));

    // Verificar o número de páginas
    const totalPages = pdfDoc.getPageCount();

    let fileToSendPath = outputPath;

    if (totalPages >= 4) {
        // Criar um novo PDF para as 4 primeiras páginas
        const newPdfDoc = await PDFDocument.create();
        const [firstPage, secondPage, thirdPage, fourthPage] = await newPdfDoc.copyPages(pdfDoc, [0, 1, 2, 3]);

        newPdfDoc.addPage(firstPage);
        newPdfDoc.addPage(secondPage);
        newPdfDoc.addPage(thirdPage);
        newPdfDoc.addPage(fourthPage);

        // Salvar o novo PDF em um buffer
        const newPdfBytes = await newPdfDoc.save();

        // Criar um arquivo temporário para o novo PDF
        const tempOutputPath = path.resolve(__dirname, 'temp_output_' + path.basename(outputPath) + '.pdf');
        fs.writeFileSync(tempOutputPath, newPdfBytes);

        fileToSendPath = tempOutputPath;
    }

    // Ler o PDF como stream
    const file = fs.createReadStream(fileToSendPath);

    // Enviar o arquivo PDF para a API da OpenAI
    const myFile = await openAi.files.create({
        file: file,
        purpose: "assistants",
    });

    console.log(myFile.id);

    // Deletar o arquivo temporário após o envio, se foi criado
    if (fileToSendPath !== outputPath) {
        fs.unlinkSync(fileToSendPath);
    }

    return myFile.id;
}