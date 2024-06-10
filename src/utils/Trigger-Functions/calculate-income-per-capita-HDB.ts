import { historyDatabase } from '@/lib/prisma';

export async function CalculateIncomePerCapitaHDB(candidateOrResponsible_id: string) {
    // Fetch all family members related to the candidate or responsible
    const familyMembers = await historyDatabase.familyMember.findMany({
        where: { OR: [{ candidate_id: candidateOrResponsible_id }, { legalResponsibleId: candidateOrResponsible_id }] },
    });

    // Fetch all incomes related to the candidate, responsible, or family members
    const familyIncomes = await historyDatabase.familyMemberIncome.findMany({
        where: {
            OR: [
                { candidate_id: candidateOrResponsible_id },
                { legalResponsibleId: candidateOrResponsible_id },
                { familyMember_id: { in: familyMembers.map(member => member.id) } }
            ]
        },
    });

    // Calculate total average income
    let totalAverageIncome = 0;

    const incomesPerMember: { [key: string]: number } = {}; // Add index signature to allow indexing with a string parameter

    familyIncomes.forEach(income => {
        const incomeMember = income.familyMember_id || income.candidate_id || income.legalResponsibleId;
        if (!incomeMember) {
            return null
        }
        if (!incomesPerMember[incomeMember]) {
            incomesPerMember[incomeMember] = 0; // Initialize income as 0 for each member
        }
        if (income.averageIncome && Number(income.averageIncome) > 0) {
            incomesPerMember[incomeMember] += Number(income.averageIncome);
    
            totalAverageIncome += Number(income.averageIncome);
        }
    });
    // Calculate income per capita
    const totalPeopleCount = familyMembers.length + 1; // +1 for the candidate or responsible
    const incomePerCapita = totalPeopleCount > 0 ? totalAverageIncome / totalPeopleCount : 0;

    // Return the calculated income per capita
    return {incomePerCapita, incomesPerMember};
}