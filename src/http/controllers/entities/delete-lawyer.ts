import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteLawyer(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const deleteParamsSchema = z.object({
        id: z.string().optional(),
    })

    const { id } = deleteParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub

        const entity = await prisma.entity.findUnique({
            where: { user_id }
        })
        if (!entity) {
            throw new NotAllowedError()
        }

        const lawyer = await prisma.lawyer.findUnique({
            where: { id: id },
            select: {
                id: true,
                user_id: true
            }
        })

        if (!lawyer) {
            throw new ResourceNotFoundError()
        }
        await prisma.$transaction([
            prisma.lawyer.delete({ where: { id: lawyer.id } }),
            prisma.user.delete({ where: { id: lawyer.user_id } })
        ])

        return reply.status(204).send()
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }

        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}
