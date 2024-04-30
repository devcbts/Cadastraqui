import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function finishRegistration(
    request: FastifyRequest,
    reply: FastifyReply,
) {

    try {
        const userId = request.user.sub

        const candidate = await prisma.candidate.findUnique({
            where: { user_id: userId },
        })

        if (!candidate) {
            throw new ResourceNotFoundError()
        }
        await prisma.candidate.update(
            {
                where: { id: candidate.id },
                data: {

                    finishedapplication: true,
                }
            },

        )

        return reply.status(201).send()
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ err })
        }
        if (err instanceof ApplicationAlreadyExistsError) {
            return reply.status(409).send({ err })
        }

        return reply.status(500).send({ message: err.message })
    }
}
