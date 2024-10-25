import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { section, toDbSection } from '../enums/Section';
import { prisma } from "@/lib/prisma";
import { openAi } from "@/lib/openAi";
import { $Enums } from '@prisma/client';

export default async function RunThread(request: FastifyRequest, reply: FastifyReply) {
    const threadParams = z.object({
        application_id: z.string(),
        sectionToFind: section,
    })
    const { application_id, sectionToFind } = threadParams.parse(request.params);
    try {
        const application = await prisma.application.findUnique({
            where: { id: application_id }
        })
        if (!application) {
            throw new Error("Application not found");
        }
        const AiAssistant = await prisma.aIAssistant.findUniqueOrThrow({
            where: { application_id_section: { application_id, section: toDbSection(sectionToFind) } }
        })
        const myRun = await openAi.beta.threads.runs.createAndPoll(
             AiAssistant.thread_id,
            {assistant_id: AiAssistant.AIassistant_id}
        );

        const myMessages = await openAi.beta.threads.messages.list(AiAssistant.thread_id);

        return reply.status(200).send({ myMessages })
    } catch (error: any) {
        return reply.status(500).send({ error: error.message })
    }
}