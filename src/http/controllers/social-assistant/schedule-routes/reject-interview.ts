import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function rejectInterview(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const interviewParams = z.object({
        interview_id: z.string(),
    })
    const rejectInterviewBody = z.object({
        rejectReason: z.string(),
        rejectComentary: z.string()
    })
    const { interview_id } = interviewParams.parse(request.params)
    const { rejectReason, rejectComentary } = rejectInterviewBody.parse(request.body)
    try {
        const user_id = request.user.sub
        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id }
        })
        if (!assistant) {
            throw new ForbiddenError()
        }

        const interview = await prisma.interviewSchedule.findUnique({
            where: { id: interview_id, date: { gte: new Date() }, assistant_id: assistant.id },

        })
        if (!interview) {
            throw new ResourceNotFoundError()
        }
        // atualizar o status da entrevista para rejeitado
        await prisma.interviewSchedule.update({
            where: { id: interview_id },
            data: {
                accepted: false,
                rejectReason,
                rejectComentary
            }
        })
        return reply.code(200).send({ message: "Entrevista rejeitada com sucesso" })
    } catch (error) {
        if (error instanceof ForbiddenError) {
            reply.code(403).send({ message: error.message })

        }
        if (error instanceof ResourceNotFoundError) {
            reply.code(404).send({ message: "Entrevista não encontrada" })
            
        }
        reply.code(500).send({ message: "Internal server Error", error })
    }
}