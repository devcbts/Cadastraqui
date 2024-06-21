import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getCandidateDashboard(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        const user = await SelectCandidateResponsible(sub)
        if (!user) {
            throw new Error('Candidato não encontrado')
        }
        const subscriptions = await prisma.application.count({
            where: { OR: [{ candidate_id: user.UserData.id }, { responsible_id: user.UserData.id }] },
        })
        const announcements = await prisma.announcementsSeen.count({
            where: { OR: [{ candidate_id: user.UserData.id }, { responsible_id: user.UserData.id }] },
        })
        return response.status(200).send({ subscriptions, announcements })

    } catch (err) {
        return response.status(400).send(err)
    }
}