import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
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
        // find the entity linked with this educationlevel
        const item = await prisma.educationLevel.findUnique({
            where: { id: educationLevel_id },
            include: { entitySubsidiary: true, announcement: { include: { entity: true } }, Application: { orderBy: [{ position: 'asc' }] } },

        })

        let entity;
        // matriz
        if (item?.entitySubsidiaryId === null) {
            entity = item?.announcement?.entity
        } else {
            // filial
            entity = item?.entitySubsidiary
        }


        const returnObj = {
            candidates: item?.Application,
            entity,
            level: item,
            announcement: item?.announcement
        }
        return reply.status(200).send(returnObj)
    } catch (error: any) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}