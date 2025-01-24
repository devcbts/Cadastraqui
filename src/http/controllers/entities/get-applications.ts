import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import SelectEntityOrDirector from './utils/select-entity-or-director'





export async function getApplications(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        announcement_id: z.string()
    })

    const { announcement_id } = applicationParamsSchema.parse(request.params)
    try {
        const userId = request.user.sub
        const role = request.user.role

        const entity = await SelectEntityOrDirector(userId, role)

        // verifica se existe o processo seletivo
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id, entity_id: entity.id }
        })

        if (announcement) {
            // verifica se o processo seletivo é da mesma entidade do assistente
            const applications = await prisma.application.findMany({
                where: { announcement_id: announcement_id },
                include: {
                    EducationLevel: { include: { course: true } },
                    _count: true,
                    ScholarshipGranted: true,
                }
            })

            // Encontra uma ou mais inscrições


            return reply.status(200).send({ applications })
        } else {
            throw new AnnouncementNotExists();
        }



    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }
        if (err instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}
