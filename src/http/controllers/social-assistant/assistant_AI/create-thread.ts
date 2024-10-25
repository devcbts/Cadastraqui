import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { dbSection, section, toDbSection } from '../enums/Section';
import { prisma } from "@/lib/prisma";
import { getSectionDocumentsPDF } from "../../candidates/AWS Routes/get-pdf-documents-by-section";

import path from "path";
import { downloadFromS3 } from "@/lib/S3";
import * as fs from 'fs';
import { openAi } from "@/lib/openAi";



// This function will create a thread in the OpenAI API and append the files to it
export default async function createThread(request: FastifyRequest, reply: FastifyReply) {
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
        const myThread = await openAi.beta.threads.create();

        // Create a thread in OpenAI API
        await prisma.aIAssistant.create({
            data: {
                thread_id: myThread.id,
                application_id: application_id,
                AIassistant_id: "asst_9kP5HOwRCEcfQirf69XWdXkl",
                section: toDbSection(sectionToFind),
            }
        })


        return reply.send({message: "Thread created successfully"})
    } catch (error: any) {
        return reply.status(500).send({error: error.message})
    }
}