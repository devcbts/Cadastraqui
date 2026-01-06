import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
const percentages = {
    cadastrante: 20,
    grupoFamiliar: 20,
    moradia: 5,
    veiculos: 5,
    rendaMensal: 20,
    despesas: 10,
    saude: 5,
    declaracoes: 15,
    documentos: 0
};
export async function saveAnnouncement(request: FastifyRequest, reply: FastifyReply) {
    const requestParams = z.object({
        announcement_id: z.string(),
    })
    const { announcement_id } = requestParams.parse(request.params)
    try {
        const user_id = request.user.sub;

        const isUser = await SelectCandidateResponsible(user_id);
        if (!isUser) {
            throw new ForbiddenError()
        }
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id }
        })
        if (!announcement) {
            throw new ResourceNotFoundError()
        }

        if (!announcement.closeDate || announcement.closeDate < new Date()) {
            return reply.status(406).send({ message: "Announcement is closed" })

        }
        const annoucementSaved = await prisma.announcementsSeen.findMany({
            where: { announcement_id, OR: [{ candidate_id: isUser.UserData.id }, { responsible_id: isUser.UserData.id }] }
        })

        if (annoucementSaved.length > 0) {
            return reply.status(406).send({ message: "Announcement already saved" })
        }
        const idField = isUser.IsResponsible ? { responsible_id: isUser.UserData.id } : { candidate_id: isUser.UserData.id }
        const registration = await prisma.finishedRegistration.findFirst({
            where: {
                OR: [
                    { candidate_id: isUser.UserData.id as string },
                    { legalResponsibleId: isUser.UserData.id as string },
                ],
            },
        });
        console.log(registration);
        if (!registration) {
            return reply.status(400).send({ message: "No finished registration found" });
        }



        let totalPercentage = 0;

        for (const [key, value] of Object.entries(percentages)) {
            if (registration[key as keyof typeof registration]) {
                totalPercentage += value;
            }
        }

        const percentage = totalPercentage;
        await prisma.announcementsSeen.create({
            data: {
                announcement_id,
                ...idField,
                percentage
            }
        })

        return reply.status(201).send({ message: "Announcement saved successfully" })
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: "Internal server Error" })
    }

}