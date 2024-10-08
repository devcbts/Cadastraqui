import { prisma } from "@/lib/prisma";
import { IncomeSource } from "@prisma/client";

export async function CalculateMemberAverageIncome(member_id: string, source: IncomeSource) {
    const memberIncomes = await prisma.monthlyIncome.findMany({
        where: {
            OR: [
                { familyMember_id: member_id },
                { candidate_id: member_id },
                { legalResponsibleId: member_id },
            
            ],
            incomeSource: source,
            receivedIncome: true
        }
    })
    const totalIncome = memberIncomes.reduce((acc: number, income: any) => {
        return acc + income.liquidAmount
    }, 0)
    const averageIncome = memberIncomes.length > 0 ? totalIncome / memberIncomes.length : '0'
   
    const updateMember = await prisma.familyMemberIncome.updateMany({
        where: { OR: [
            { familyMember_id: member_id },
            { candidate_id: member_id },
            { legalResponsibleId: member_id },
        
        ] , employmentType: source},
        data: { averageIncome: String(averageIncome)}
    })
}