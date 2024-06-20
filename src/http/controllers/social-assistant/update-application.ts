// Função desse código é servir como a última ação do assistente social em uma inscrição
// Ele pode conceder uma bolsa e gerar um registro no histórico e um indice na tabela de bolsas concedidas
// Ou ele pode escolher não conceder a bolsa e só gerar um registro no histórico de que o candidato teve seu pedido negado

import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function updateApplication(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        application_id: z.string(),

    })
    const statusType = z.enum(["Approved", "Rejected", "Pending", "WaitingList"])

    const applicationUpdateSchema = z.object({
        status: statusType.optional(),
        report: z.string().optional(),
        partial: z.boolean().optional()
    })
    const { application_id } = applicationParamsSchema.parse(request.params)
    const { status, report, partial } = applicationUpdateSchema.parse(request.body)
    try {
        const userType = request.user.role
        const userId = request.user.sub

        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId },
        })

        if (!assistant) {
            throw new ResourceNotFoundError()
        }


        // Caso 1: gaveUp true
        await prisma.application.update({
            where: {id: application_id},
            data:{
                status: status,
                ScholarshipPartial: partial
                
            }
        })
        if (status === 'Rejected') {
            
            await prisma.applicationHistory.create({
                data:{
                    application_id,
                    description:'Inscrição indeferida',
                }
            })
        }
        if (status === 'Approved') {
            
            await prisma.applicationHistory.create({
                data:{
                    application_id,
                    description:'Inscrição deferida',
                }
            })
        }
        return reply.status(201).send({ message: "Ação realizada com sucesso" })

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
