import { APIError } from "@/errors/api-error";
import { GetUrl } from "@/http/services/get-file";
import { prisma } from "@/lib/prisma";
import { getUserEntity } from "@/utils/get-user-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAnnouncementResume(req: FastifyRequest, res: FastifyReply) {
    try {
        const { sub, role } = req.user
        const schema = z.object({
            id: z.string().min(1, 'Id do edital obrigatório')
        })
        const { success, error, data } = schema.safeParse(req.params)
        if (!success) {
            throw new APIError(error.issues.map(x => x.message).join('.'))
        }
        const entityId = await getUserEntity(sub, role)
        if (!entityId) {
            throw new APIError('Instituição não encontrada')
        }
        const { id } = data

        const announcement = await prisma.announcement.findUnique({
            where: { id },
            select: {
                announcementName: true,
                announcementBegin: true,
                announcementDate: true,
                entity: {
                    include: {
                        EntitySubsidiary: true,
                    }
                },
                educationLevels: true,
                Application: true
            }
        })
        if (!announcement) {
            throw new APIError('Edital não encontrado')
        }
        const Route = `ProfilePictures/${announcement.entity.id}`
        const url = await GetUrl(Route)


        const totalApplications = announcement.Application.length
        const totalWaiting = announcement.Application.filter(x => x.candidateStatus === 'WaitingList').length
        const totalRejected = announcement.Application.filter(x => x.status === 'Rejected').length
        const totalApproved = announcement.Application.filter(x => x.status === 'Approved').length

        const vacanciesPerEntity = announcement.educationLevels.reduce((acc: Record<string, any>, curr) => {
            const id = (curr.entitySubsidiaryId || announcement.entity.id)
            const isSubsidiary = !!curr.entitySubsidiaryId
            if (!acc[id]) {
                acc[id] = {}
                acc[id].name = isSubsidiary
                    ? announcement.entity.EntitySubsidiary.find(x => x.id === id)?.socialReason
                    : announcement.entity.socialReason
                acc[id].total = 0
            }
            acc[id].total += curr.verifiedScholarships
            return acc
        }, {})
        const availableVacancies = Object.values(vacanciesPerEntity)

        return res.status(200).send({
            entity: { ...announcement.entity, img: url },
            announcement: announcement,
            availableVacancies,
            totalApplications,
            totalApproved,
            totalRejected,
            totalWaiting
        })
    } catch (err) {
        console.log(err)
        if (err instanceof APIError) {
            return res.status(400).send({
                message: err.message
            })
        }
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}