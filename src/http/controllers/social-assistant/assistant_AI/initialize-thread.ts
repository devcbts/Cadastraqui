import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { dbSection, section, toDbSection } from '../enums/Section';
import { prisma } from "@/lib/prisma";
import { getSectionDocumentsPDF } from "../../candidates/AWS Routes/get-pdf-documents-by-section";

import path from "path";
import { downloadFromS3 } from "@/lib/S3";
import * as fs from 'fs';
import { openAi } from "@/lib/openAi";
import getSectionInitalContent from "@/utils/AI Assistant/get-section-inital-content";
import { getSectionDocumentsPDF_HDB } from "../AWS-routes/get-documents-by-section-HDB";



// This function will create a thread in the OpenAI API and append the files to it
export default async function InitializeThread(request: FastifyRequest, reply: FastifyReply) {
    const threadParams = z.object({
        application_id: z.string(),
        sectionToFind : section,

    })    
    const { application_id, sectionToFind } = threadParams.parse(request.params);
    try {
        const application = await prisma.application.findUnique({
            where: {id: application_id}
        })
        if (!application) {
            throw new Error("Application not found");
        }
      
        const AiAssistant = await prisma.aIAssistant.findUniqueOrThrow({
            where: {application_id_section: {application_id, section: toDbSection(sectionToFind)}}
        })
        



        const files = await getSectionDocumentsPDF_HDB(application_id, sectionToFind);

        if (!files) {
            console.log("Nenhum arquivo PDF encontrado.");
            return;
        }

     


        // Array para armazenar os IDs dos arquivos criados
        const fileIds = [];

        // Iterar sobre cada arquivo PDF e enviar para a OpenAI
        for (const [folder, fileContents] of Object.entries(files)) {
            for (const [fileName, url] of Object.entries(fileContents)) {
                const cleanFileName = fileName.replace(/^url_/, '');
                const memberId = folder.split('/')[3];
                const outputPath = path.resolve(__dirname,  memberId + "_" + cleanFileName);
                console.log(folder, cleanFileName, url);
                const fileBuffer = await downloadFromS3(`${folder}/${cleanFileName}`, outputPath);
          
                // Ler o arquivo baixado
                

                // Convert Buffer to File
                const file = fs.createReadStream(__dirname + '/' + memberId + "_" + cleanFileName);

                // Enviar o arquivo PDF para a API da OpenAI
                const myFile = await openAi.files.create({
                    file:file,
                    purpose: "assistants",
                });

                // Adicionar o ID do arquivo ao array
                fileIds.push(myFile.id);
                // deletar o arquivo após o envio
                fs.unlinkSync(__dirname + '/' + memberId + "_" + cleanFileName);
            }
        }
        const attachments = fileIds.map(fileId => ({
            file_id: fileId,
            tools: [{ type: "file_search" as const }],
        }));

        const content = await getSectionInitalContent(sectionToFind, application_id);

        const myMessage = await openAi.beta.threads.messages.create(
            AiAssistant.thread_id,
            {
                role: "user",
                content: content,
                attachments: attachments,
            }
        );



        return reply.status(200).send({myMessage})
    } catch (error: any) {
        return reply.status(500).send({error: error.message})
    }
}