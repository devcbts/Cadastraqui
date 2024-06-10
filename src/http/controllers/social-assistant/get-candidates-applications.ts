import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidatesApplications(
    request: FastifyRequest,
    reply: FastifyReply,
){
    const requestParamsSchema = z.object({
        educationLevel_id: z.string(),
    })

    const { educationLevel_id } = requestParamsSchema.parse(request.params)
    try {
        const userId = request.user.sub;
        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId }
        })
        if (!assistant) {
            throw new ForbiddenError()
            
        }
        const applications = await prisma.application.findMany({
            where: {educationLevel_id},
            orderBy: [
                {
                    position: 'asc'
                }
            ]
        })
        return reply.status(200).send({ applications })
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        return reply.status(500).send({ message: 'Internal server error' })
    }
}