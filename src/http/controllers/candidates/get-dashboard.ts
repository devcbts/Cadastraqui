import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { CalculateIncomePerCapita } from "@/utils/Trigger-Functions/calculate-income-per-capita";
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
        const expense = await prisma.expense.findMany({
            where: { candidate_id: user.UserData.id }
        })
        const avgExpense = (expense.reduce((acc, expense) => {
            return acc += expense.totalExpense ?? 0
        }, 0) / (expense.length == 0 ? 1 : expense.length)).toFixed(2)
        const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapita(user.UserData.id);

        return response.status(200).send({ subscriptions, announcements, familyIncome: incomePerCapita * (1 + members.length), avgExpense })

    } catch (err) {
        return response.status(400).send(err)
    }
}