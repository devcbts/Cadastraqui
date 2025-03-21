import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function getLawyers(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const user_id = request.user.sub
        const role = request.user.role

        const entity = await SelectEntityOrDirector(user_id, role)

        const lawyers = await prisma.lawyer.findMany({
            where: {
                entity_id: entity.id
            },
        })

        return reply.status(200).send({
            lawyers
        })
    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })

        }
        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}
