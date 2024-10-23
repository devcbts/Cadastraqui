import { z } from "zod";
import { historyDatabase, prisma } from "@/lib/prisma";

import path from "path";
import { downloadFromS3 } from "@/lib/S3";
import * as fs from 'fs';
import { openAi } from "@/lib/openAi";
import getSectionInitalContent from "@/utils/AI Assistant/get-section-inital-content";
import { EventEmitter } from 'events';
import { section, toDbSection } from "@/http/controllers/social-assistant/enums/Section";
import { getDocumentsUrls } from "@/utils/assistant/get-documents-urls";
import { PDFDocument } from "pdf-lib";

// Aumentar o limite de listeners para evitar o aviso
EventEmitter.defaultMaxListeners = 20;

// Função para adicionar um atraso
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para criar uma thread na API da OpenAI e anexar os arquivos a ela
export async function initializeThread( application_id: string, sectionToFind: section, member_id: string, table_id: string | null) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: application_id }
        });
        if (!application) {
            throw new Error("Application not found");
        }

        const AiAssistant = await prisma.aIAssistant.findUniqueOrThrow({
            where: { application_id_section_member_table: { application_id, section: toDbSection(sectionToFind), member_id,table_id: table_id ?? '' } }
        });

        let files;
        if (sectionToFind === 'income') {
            files = await getDocumentsUrls([table_id ? `income/${member_id}/${table_id}` : `income/${member_id}` ], application_id);
            const income = await historyDatabase.familyMemberIncome.findUniqueOrThrow({
                where: { application_id: application_id, id: table_id! },
                include: {
                    MonthlyIncomes: true
                }
            })
            for (const monthlyIncome of income.MonthlyIncomes) {
                files = [...files, ...(await getDocumentsUrls([`monthly-income/${member_id}/${monthlyIncome.id}`], application_id))];
            }
            console.log(files)
        } else if (sectionToFind === 'health') {
            files = await getDocumentsUrls([`${sectionToFind}/${member_id}`, `medication/${member_id}`], application_id);
        } else {
            files = await getDocumentsUrls([`${sectionToFind}/${member_id}`], application_id);
        }
        if (!files) {
            console.log("Nenhum arquivo PDF encontrado.");
            return;
        }

        // Array para armazenar os IDs dos arquivos criados
        let fileIds: string[] = [];

        // Array de promessas para processar os arquivos
        const promises: Promise<void>[] = [];

        // Iterar sobre cada arquivo PDF e enviar para a OpenAI
        files.forEach((fileSection) => {
            for (const [section, sectionContent] of Object.entries(fileSection)) {
                for (const [folder, fileContents] of Object.entries(sectionContent)) {
                    for (const [fileName, url] of Object.entries(fileContents)) {
                        const promise = (async () => {
                            const cleanFileName = fileName.replace(/^url_/, '');
                            const folderSection = folder.split('/')[2];
                            const folderMember = folder.split('/')[3];
                            if (folderMember !== member_id) {
                                return;
                            }
                            const outputPath = path.resolve(__dirname, folderSection + "_" + member_id + "_" + cleanFileName);
                            console.log(folder, cleanFileName, url);
                            await downloadFromS3(`${folder}/${cleanFileName}`, outputPath);

                            // Adicionar um atraso de 500ms
                            await delay(500);

                            // Verificar se o arquivo foi baixado corretamente
                            if (!fs.existsSync(outputPath)) {
                                console.error(`Erro: Arquivo não encontrado após download: ${outputPath}`);
                                return;
                            }

                            // Enviar o arquivo PDF para a API da OpenAI

                            // Adicionar o ID do arquivo ao array
                            const fileId = await processFile(outputPath);
                            fileIds.push(fileId);
                            // deletar o arquivo após o envio
                            if (fs.existsSync(outputPath)) {
                                fs.unlinkSync(outputPath);
                            } else {
                                console.warn(`Arquivo não encontrado: ${outputPath}`);
                            }

                            // Adicionar um atraso de 500ms
                            await delay(100);
                        })();
                        promises.push(promise);
                    }
                }
            }
        });

        // Aguardar todas as promessas serem concluídas
        await Promise.all(promises);
        console.log(fileIds);

        const content = await getSectionInitalContent(sectionToFind, application_id,member_id, table_id);

        // Dividir os IDs dos arquivos em lotes de 10
        const batches = [];
        for (let i = 0; i < fileIds.length; i += 10) {
            batches.push(fileIds.slice(i, i + 10));
        }

        // Enviar uma mensagem para cada lote de arquivos
        for (const batch of batches) {
            const attachments = batch.map(fileId => ({
                file_id: fileId,
                tools: [{ type: "file_search" as const }],
            }));

            const myMessage = await openAi.beta.threads.messages.create(
                AiAssistant.thread_id,
                {
                    role: "user",
                    content: "Aqui estão os arquivos",
                    attachments: attachments,
                }
            );
            console.log(`Message sent with attachments: ${batch}`);
        }

        const myMessage = await openAi.beta.threads.messages.create(
            AiAssistant.thread_id,
            {
                role: "user",
                content: content ? content : "Nenhum conteúdo encontrado",
            }
        );

        console.log("Messages sent successfully");
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

async function processFile(outputPath: string) {
    // Ler o arquivo PDF original
    const existingPdfBytes = fs.readFileSync(outputPath);

    // Carregar o PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

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