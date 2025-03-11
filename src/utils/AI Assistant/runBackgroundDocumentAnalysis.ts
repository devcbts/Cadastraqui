import { FastifyReply, FastifyRequest } from "fastify";
import { openAi } from "@/lib/openAi";
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument } from "pdf-lib";
import { MultipartFile } from "@fastify/multipart";
import { z } from "zod";
import { downloadFromS3 } from "@/lib/S3";
import { DocumentAnalysisStatus, Prisma } from "@prisma/client";
import searchObjectToSend from "./searchObjectToSend";
import { prisma } from "@/lib/prisma";

export const MAX_FILE_SIZE = 1024 * 1024 * 10;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));




export async function runBackgroundDocumentAnalysis({ documentPath, tableName, tableId, metadata }: { documentPath: string, tableName: string, tableId: string, metadata: Prisma.JsonObject }) {

    let document
    try {
         document = await prisma.candidateDocuments.findUniqueOrThrow({
            where: {
                id: documentPath
            }
        })

        await prisma.candidateDocuments.update({
            where: {
                id: documentPath
            },
            data: {
                analysisStatus: 'Pending'
            }
        })
        const myThread = await openAi.beta.threads.create();
        const outputPath = './temp' + tableId + '.pdf';
        const file = await downloadFromS3(documentPath, outputPath);
        // Adicionar um atraso de 500ms
        await delay(500);

        // Verificar se o arquivo foi baixado corretamente
        if (!fs.existsSync(outputPath)) {
            console.error(`Erro: Arquivo não encontrado após download: ${outputPath}`);
            return
        }

        const fileIds = [];

        
        const fileId = await processFile(outputPath);
        fileIds.push(fileId);

        await fs.promises.unlink(outputPath); // Remove o arquivo temporário

        const attachments = fileIds.map(fileId => ({
            file_id: fileId,
            tools: [{ type: "file_search" as const }],
        }));

        const objectToSend = searchObjectToSend({ tableId, tableName, metadata });

        const myMessage = await openAi.beta.threads.messages.create(
            myThread.id,
            {
                role: "user",
                content: JSON.stringify(objectToSend), // Converte o objeto para uma string JSON
                attachments: attachments,
            }
        );
        await openAi.beta.threads.runs.createAndPoll(
            myThread.id,
            {
                assistant_id: "asst_rcQO8gwbdGud2MraQlDUCg98",
            }
        );
    
        const response = await openAi.beta.threads.messages.list(myThread.id);
        const parsedResponse: {
            legibilidade: boolean,
            inconsistenias: string[],
            typeDocument: boolean,
            coherent: boolean,
            description: string,
        } | null | undefined = parseAIResponse(response);
       let analysisStatus : DocumentAnalysisStatus = "Declined"
        if(parsedResponse && (!parsedResponse.legibilidade || !parsedResponse.coherent || !parsedResponse.typeDocument)){
            analysisStatus = "Approved"
        }
        await prisma.candidateDocuments.update({
            where: {
                id: documentPath
            },
            data: {
                analysisStatus: analysisStatus,
                AiData: parsedResponse ?? undefined
            }
        })

    } catch (error: any) {
        if (document) {
            await prisma.candidateDocuments.update({
                where: {
                    id: documentPath
                },
                data: {
                    analysisStatus: 'Failed'
                }
            })
        }
        console.error("Error:", error.message);
    }
}

async function processFile(filePath: string) {
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(new Uint8Array(existingPdfBytes));
    const totalPages = pdfDoc.getPageCount();

    let fileToSendPath = filePath;

    if (totalPages >= 4) {
        const newPdfDoc = await PDFDocument.create();
        const [firstPage, secondPage, thirdPage, fourthPage] = await newPdfDoc.copyPages(pdfDoc, [0, 1, 2, 3]);

        newPdfDoc.addPage(firstPage);
        newPdfDoc.addPage(secondPage);
        newPdfDoc.addPage(thirdPage);
        newPdfDoc.addPage(fourthPage);

        const newPdfBytes = await newPdfDoc.save();
        const tempOutputPath = path.resolve(__dirname, 'temp_output_' + path.basename(filePath) + '.pdf');
        fs.writeFileSync(tempOutputPath, newPdfBytes);

        fileToSendPath = tempOutputPath;
    }

    const file = fs.createReadStream(fileToSendPath);
    const myFile = await openAi.files.create({
        file: file,
        purpose: "assistants",
    });

    if (fileToSendPath !== filePath) {
        fs.unlinkSync(fileToSendPath);
    }

    return myFile.id;
}

function parseAIResponse(response: any) {
    const aiMessage = response.data.find((message: any) => message.role === 'assistant');
    if (!aiMessage) {
        return null;
    }
    let parsedContent;
    try {
        const content = aiMessage.content[0].text.value;

        // Extrair o JSON entre o primeiro "{" e o último "}"
        const jsonString = content.substring(content.indexOf("{"), content.lastIndexOf("}") + 1);
        console.log(jsonString);
        parsedContent = JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing AI response content:", error);
        return null;
    }
    return parsedContent;
}