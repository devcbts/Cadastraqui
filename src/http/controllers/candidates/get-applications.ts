import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function getApplications(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        application_id: z.string().optional(),
    })
    const applicationBodySchema = z.object({
        candidate_id: z.string().optional(),
    })

    const { application_id } = applicationParamsSchema.parse(request.params)
    const { candidate_id } = applicationBodySchema.parse(request.body)
    console.log("chegamos aqui")

    try {
        const userType = request.user.role
        const userId = request.user.sub

        if (userType !== "CANDIDATE" && userType !== "RESPONSIBLE") {
            throw new NotAllowedError()
        }


        if (userType === "CANDIDATE") {

            const candidate = await prisma.candidate.findUnique({
                where: { user_id: userId },
            })
            if (!candidate) {
                throw new NotAllowedError()
            }

            if (application_id) {
                const application = await prisma.application.findUnique({
                    where: { id: application_id }
                })

                return reply.status(200).send({ application })
            }
            else {
                const applications = await prisma.application.findMany({
                    where: { candidate_id: candidate.id }
                })

                return reply.status(200).send({ applications })
            }
        }
        else {
            const candidate = await prisma.candidate.findUnique({
                where: { id: candidate_id }
            })
            if (!candidate) {
                throw new NotAllowedError()
            }

            if (application_id) {
                const application = await prisma.application.findUnique({
                    where: { id: application_id }
                })

                return reply.status(200).send({ application })
            }
            else {
                const applications = await prisma.application.findMany({
                    where: { candidate_id: candidate.id }
                })

                return reply.status(200).send({ applications })
            }
        }






    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: err.message })
    }
}
