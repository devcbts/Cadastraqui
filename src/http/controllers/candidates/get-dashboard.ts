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

        const {
            subscriptions,
            announcements,
            members,
            pendencies,
            expense
        } = await prisma.$transaction(async (prisma) => {
            // Contagem de subscriptions
            const subscriptions = await prisma.application.count({
                where: { OR: [{ candidate_id: user.UserData.id }, { responsible_id: user.UserData.id }] },
            });

            // Contagem de announcements
            const announcements = await prisma.announcementsSeen.count({
                where: { OR: [{ candidate_id: user.UserData.id }, { responsible_id: user.UserData.id }] },
            });

            // Buscando family members com FamilyMemberIncome
            const members = await prisma.familyMember.findMany({
                where: { OR: [{ candidate_id: user.UserData.id }, { legalResponsibleId: user.UserData.id }] },
                include: {
                    FamilyMemberIncome: true
                }
            });

            // Buscando applications
            const applications = await prisma.application.findMany({
                where: { OR: [{ candidate_id: user.UserData.id }, { responsible_id: user.UserData.id }] },
                select: { id: true }
            });

            // Contagem de pendências relacionadas às applications
            const pendencies = await prisma.requests.count({
                where: { AND: [{ application_id: { in: applications.map(e => e.id) } }, { answered: false }] }
            });

            // Buscando despesas (expenses)
            const expense = await prisma.expense.findMany({
                where: { OR: [{ candidate_id: user.UserData.id }, { legalResponsibleId: user.UserData.id }] },
                take: 3,
                orderBy: {
                    date: 'desc',
                },
            });

            // Retorna todos os resultados
            return {
                subscriptions,
                announcements,
                members,
                pendencies,
                expense
            };
        });
        const avgExpense = (expense.reduce((acc, expense) => {
            return acc += expense.totalExpense ?? 0
        }, 0) / (expense.length == 0 ? 1 : expense.length)).toFixed(2)
        const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapita(user.UserData.id);

        return response.status(200).send({ subscriptions, announcements, familyIncome: incomePerCapita, avgExpense, pendencies })

    } catch (err) {
        return response.status(400).send(err)
    }
}