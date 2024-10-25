import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { dbSection, section, toDbSection } from '../enums/Section';
import { prisma } from "@/lib/prisma";

import { openAi } from "@/lib/openAi";



// This function will create a thread in the OpenAI API and append the files to it
export default async function getThreadMessages(request: FastifyRequest, reply: FastifyReply) {
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
        

        const myMessages = await openAi.beta.threads.messages.list(AiAssistant.thread_id);

        


        return reply.status(200).send({myMessages})
    } catch (error: any) {
        return reply.status(500).send({error: error.message})
    }
}