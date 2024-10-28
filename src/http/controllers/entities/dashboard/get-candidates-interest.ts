import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AnnouncementNotExists } from '../../../../errors/announcement-not-exists-error';

export default async function getCandidatesInterest(request: FastifyRequest, reply: FastifyReply) {
    const interestSchema = z.object({
        announcement_id: z.string()
    })

    const { announcement_id } = interestSchema.parse(request.params)
    try {

        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id }
        })
        if (!announcement) {
            throw new AnnouncementNotExists()
        }

        const allInterest = await prisma.announcementsSeen.findMany({
            where: { announcement_id },
            include: {
                candidate: {
                    include: {
                        FinishedRegistration: true
                    }
                },
                responsible: {
                    include: {
                        FinishedRegistration: true
                    }
                }

            }
        })
        const numberOfInterested = allInterest.length
        let numberOfFinishedRegistration = 0 
        for (const userInterest of allInterest) {
            const completions = userInterest.candidate?.FinishedRegistration || userInterest.responsible?.FinishedRegistration
            if (!completions) {
                continue
            }
            // Verificar se todas as propriedades são true
            const allCompleted = completions.cadastrante &&
                completions.grupoFamiliar &&
                completions.moradia &&
                completions.veiculos &&
                completions.rendaMensal &&
                completions.despesas &&
                completions.saude &&
                completions.declaracoes &&
                completions.documentos;

            if (allCompleted) {
                numberOfFinishedRegistration++
            }
        }


        const applications = await prisma.application.count({
            where: { announcement_id }
        })

        return reply.status(200).send({
            numberOfInterested,
            numberOfApplications: applications,
            numberOfFinishedRegistration,
            numberOfUnfinishedRegistration: numberOfInterested - numberOfFinishedRegistration
        })
    } catch (error: any) {
        if (error instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}