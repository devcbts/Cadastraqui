import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateSingularInterview (request: FastifyRequest, reply: FastifyReply){
    const updateSingularInterviewParams = z.object({
        interview_id: z.string(),
    })
    
    const updateSingularInterviewLink = z.object({
        link: z.string(),
    })
    const updateSingularInterviewComentary = z.object({
        InterviewComentary: z.string(),
    
    })
    const updateSingularInterviewRealized = z.object({
        InterviewRealized: z.boolean(),
        InterviewNotRealizedReason: z.string().optional(),
        InterviewNotRealizedComentary: z.string().optional(),

    })
    const bodySchema = z.union([updateSingularInterviewLink, updateSingularInterviewComentary, updateSingularInterviewRealized])
    const { interview_id } = updateSingularInterviewParams.parse(request.params)
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
        // Se estivermos atualizando apenas o link
        if(updateSingularInterviewLink.safeParse(bodySchema).success){
            const { link } = updateSingularInterviewLink.parse(request.body)
            await prisma.interviewSchedule.update({
                where: { id: interview_id },
                data: {
                    interviewLink: link
                }
            })
        }
        // Atualizar o comentário da entrevista
        if (updateSingularInterviewComentary.safeParse(bodySchema).success){
            const { InterviewComentary } = updateSingularInterviewComentary.parse(request.body)
            await prisma.interviewSchedule.update({
                where: { id: interview_id },
                data: {
                    InterviewComentary
                }
            })
            
        }
        // Atualizar se a entrevista foi realizada ou não
        if (updateSingularInterviewRealized.safeParse(bodySchema).success){
            const { InterviewRealized, InterviewNotRealizedReason, InterviewNotRealizedComentary } = updateSingularInterviewRealized.parse(request.body)
            await prisma.interviewSchedule.update({
                where: { id: interview_id },
                data: {
                    InterviewRealized,
                    InterviewNotRealizedReason,
                    InterviewNotRealizedComentary
                }
            })
            
        }

        return reply.code(200).send({ message: "Entrevista atualizada com sucesso" })
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