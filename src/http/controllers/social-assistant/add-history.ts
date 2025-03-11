import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function addHistory(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        application_id: z.string(),
        
    })
    const applicationBodySchema = z.object({
        description: z.string(),
        status: z.enum(['Approved','Rejected','Pending']).optional()
    })
    const { application_id } = applicationParamsSchema.parse(request.params)
    const {description, status} = applicationBodySchema.parse(request.body)
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
            throw new ResourceNotFoundError()
        }

        // Criar novo report no histórico da inscrição
        await prisma.applicationHistory.create({
            data:{
                application_id,
                description: description

            },
        })

        // Altera o status da inscrição
        if (status) {
            await prisma.application.update({
                data:{
                    status
                },
                where: {id: application_id}
            })
        }



        return reply.status(201).send({message:"Histórico Criado"})
    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: err.message })
    }
}
