import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getStudentPreviousAnnouncements(request: FastifyRequest, response: FastifyReply) {
    try {
        const schema = z.object({
            candidate_id: z.string()
        })
        const { error, data } = schema.safeParse(request.params)
        if (error) {
            throw new APIError('Parâmetros incorretos')
        }
        const { candidate_id } = data
        const applicationWithAnnouncements = await prisma.candidate.findUnique({
            where: { id: candidate_id },
            select: {
                Application: {
                    where: {
                        announcement: { announcementType: "PeriodicVerification" },
                    },
                    select: {
                        announcement: true
                    }
                }
            }
        })
        return response.status(200).send({ announcements: applicationWithAnnouncements?.Application.map(e => e.announcement) })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}