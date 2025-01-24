// Função desse código é servir como a última ação do assistente social em uma inscrição
// Ele pode conceder uma bolsa e gerar um registro no histórico e um indice na tabela de bolsas concedidas
// Ou ele pode escolher não conceder a bolsa e só gerar um registro no histórico de que o candidato teve seu pedido negado

import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function updateSolicitationWithReport(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const solictationParamsSchema = z.object({
        solicitation_id: z.string(),


    })

    const solicitationBodySchema = z.object({
        report: z.string()
    })

    const { solicitation_id } = solictationParamsSchema.parse(request.params)
    const { report } = solicitationBodySchema.parse(request.body)

    try {

        // Caso 1: gaveUp true
        await prisma.applicationHistory.update({
            where: { id: solicitation_id },
            data: {
                report: report
            }
        })
        return reply.status(201).send({ message: "Ação realizada com sucesso" })

    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}
