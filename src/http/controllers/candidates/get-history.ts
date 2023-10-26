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
        announcement_id: z.string(),

    })

    const { announcement_id } = applicationParamsSchema.parse(request.params)
    try {
        const userType = request.user.role
        const userId = request.user.sub

        if (userType !== 'CANDIDATE') {
            throw new NotAllowedError()
        }

        const candidate = await prisma.candidate.findUnique({
            where: { user_id: userId }
        })

        if (!candidate) {
            throw new ResourceNotFoundError()
        }

        const application = await prisma.application.findUnique({
            where: {
                candidate_id_announcement_id: {

                    candidate_id: candidate.id, announcement_id
                },
            }
        })

        if (!application) {
            throw new ResourceNotFoundError()
        }

        const applicationhistories = await prisma.applicationHistory.findMany({
            where: {application_id: application.id}
        })


        return reply.status(200).send({applicationhistories})


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
