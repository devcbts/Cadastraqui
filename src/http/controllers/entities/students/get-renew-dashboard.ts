import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getRenewDashboard(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user

        const entity = await prisma.entity.findUnique({
            where: { user_id: sub },
            include: {
                EntitySubsidiary: {
                    include: {
                        Announcement: {
                            where: { announcementType: "PeriodicVerification" },
                            select: {
                                verifiedScholarships: true,
                            }
                        }
                    }
                },
                Announcement: {
                    where: { announcementType: "PeriodicVerification" },
                    select: {
                        verifiedScholarships: true,
                    }
                }

            }
        })
        if (!entity) {
            throw new APIError('Instituição não encontrada')
        }
        const announcementCount = entity?.Announcement.length! + (entity?.EntitySubsidiary.reduce((acc, curr) => acc += curr?.Announcement.length, 0) ?? 0)
        const scholarshipsCount = entity.Announcement.concat(...entity.EntitySubsidiary.map(e => e.Announcement)).reduce((acc, curr) => {
            return acc += curr.verifiedScholarships
        }, 0)
        return response.status(200).send({
            renewAnnouncements: announcementCount,
            totalScholarships: scholarshipsCount
        })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}