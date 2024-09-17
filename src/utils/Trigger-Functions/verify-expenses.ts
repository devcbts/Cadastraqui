import { SelectCandidateResponsible } from "../select-candidate-responsible";
import { prisma } from "../../lib/prisma";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export default async function verifyExpenses(candidateOrResponsibleId: string) {
    const candidateOrResponsible = await SelectCandidateResponsible(candidateOrResponsibleId);
    if (!candidateOrResponsible) {
        return null
    }
    const threeMonthsAgo = subMonths(new Date(), 3);
    const startDate = startOfMonth(threeMonthsAgo);
    const endDate = endOfMonth(new Date());
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id };

    const expensesCount = await prisma.expense.count({
        where: {
           ...idField,
           date: {
            gte: startDate,
            lte: endDate
           }
        }
    });

    let update = true;
    if (expensesCount < 3) {
        update = false;
    }

    await prisma.finishedRegistration.upsert({
        where: idField,
        create: {
            despesas: update, ...idField
        },
        update: {
            despesas: update

        }
    })

    return "Dados Atualizados com sucesso"
}
