import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidatesApplications(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const requestParamsSchema = z.object({
        educationLevel_id: z.string(),
    })

    const { educationLevel_id } = requestParamsSchema.parse(request.params)
    try {
        const userId = request.user.sub;
        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId }
        })
        if (!assistant) {
            throw new ForbiddenError()

        }
        const applications = await prisma.application.findMany({
            where: { educationLevel_id },
            orderBy: [
                {
                    position: 'asc'
                }
            ]
        })

        const [item] = applications
        const announcementId = item.announcement_id
        const announcement = await prisma.announcement.findUnique({
            where: {
                id: announcementId
            },
            include: {
                entity: true,
                educationLevels: true,
                entity_subsidiary: true
            }
        })
        const level = announcement?.educationLevels.find(l => l.id === educationLevel_id)

        let entity;
        // matriz
        if (level?.entitySubsidiaryId === null) {
            entity = announcement?.entity
        } else {
            // filial
            entity = announcement?.entity_subsidiary.find(e => e.id === level?.entitySubsidiaryId)
        }


        const returnObj = {
            candidates: applications ?? [],
            entity,
            level,
            announcement
        }
        return reply.status(200).send(returnObj)
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        return reply.status(500).send({ message: 'Internal server error' })
    }
}