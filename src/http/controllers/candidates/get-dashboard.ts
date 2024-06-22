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
        const members = await prisma.familyMember.findMany({
            where: { candidate_id: user.UserData.id },
            include: {
                FamilyMemberIncome: true
            }
        })
        const familyIncome = members.reduce((acc, v) => {
            const memberIncome =
                v.FamilyMemberIncome.length
                    ? v.FamilyMemberIncome.reduce((acc2, v2) => {
                        return acc2 += parseInt(v2.averageIncome) ?? 0;
                    }, 0) / v.FamilyMemberIncome.length
                    : 0
            return acc += memberIncome
        }, 0) / (members?.length ?? 1)

        return response.status(200).send({ subscriptions, announcements, familyIncome })

    } catch (err) {
        return response.status(400).send(err)
    }
}