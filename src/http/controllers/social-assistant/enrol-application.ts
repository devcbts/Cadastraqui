import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function enrollApplication(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        application_id: z.string()
    })

    const { application_id } = applicationParamsSchema.parse(request.params)
    try {
        const userType = request.user.role
        const userId = request.user.sub

        if (userType !== 'ASSISTANT') {
            throw new NotAllowedError()
        }

        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId },
        })

        if (!assistant) {
            throw new NotAllowedError()
        }

        // atualizar inscrição
        await prisma.application.update({
            data:{
                socialAssistant_id: assistant.id,
                SocialAssistantName: assistant.name
            },
            where: {id: application_id}
        })

        // Criar novo report no histórico da inscrição
        await prisma.applicationHistory.create({
            data:{
                application_id,
                description: "Sua inscrição está em processo de análise"

            }
        })




    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: err.message })
    }
}
