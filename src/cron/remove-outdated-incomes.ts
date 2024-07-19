import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import nodeSchedule from 'node-schedule';
import { prisma } from '../lib/prisma';

export async function removeOutdatedIncome() {
    const deletedIncomes: { id: string; receivedIncome: boolean | null; date: Date | null; grossAmount: number | null; liquidAmount: number | null; proLabore: number | null; dividends: number | null; total: number | null; deductionValue: Decimal | null; publicPension: Decimal | null; incomeTax: Decimal | null; otherDeductions: Decimal | null; foodAllowanceValue: Decimal | null; transportAllowanceValue: Decimal | null; expenseReimbursementValue: Decimal | null; advancePaymentValue: Decimal | null; reversalValue: Decimal | null; compensationValue: Decimal | null; judicialPensionValue: Decimal | null; familyMember_id: string | null; candidate_id: string | null; incomeSource: $Enums.IncomeSource | null; legalResponsibleId: string | null; }[] = []; // Passo 1
    try {
        const uniqueGroups = await prisma.monthlyIncome.findMany({
            select: {
                familyMember_id: true,
                candidate_id: true,
                legalResponsibleId: true,
                incomeSource: true,
            },
            distinct: ['familyMember_id', 'candidate_id', 'legalResponsibleId', 'incomeSource']
        });

        for (const group of uniqueGroups) {
            const oldestIncome = await prisma.monthlyIncome.findFirst({
                where: {
                    candidate_id: group.candidate_id,
                    familyMember_id: group.familyMember_id,
                    legalResponsibleId: group.legalResponsibleId,
                    incomeSource: group.incomeSource,
                },
                orderBy: {
                    date: 'asc'
                },
            });

            if (oldestIncome) {
                await prisma.$transaction(async (tsPrisma) => {

                    const deleted = await tsPrisma.monthlyIncome.delete({
                        where: {
                            id: oldestIncome.id
                        }
                    });

                    deletedIncomes.push(deleted); // Passo 2

                    // Indicar no banco de dados que a renda está desatualizada
                    await tsPrisma.familyMemberIncome.updateMany({
                        where: {
                            candidate_id: group.candidate_id,
                            familyMember_id: group.familyMember_id,
                            legalResponsibleId: group.legalResponsibleId,
                            employmentType: group.incomeSource,
                        },
                        data: {
                            isUpdated: false,
                        }
                    })
                })

            }
        }
    } catch (err) {
        // Handle error
    }
    return deletedIncomes; // Passo 3
}

//Runs every day 1 of the month at 2 AM
const RemoveOutdatedIncomes: nodeSchedule.Job = nodeSchedule.scheduleJob("0 0 2 1 * * ", async () => {
    const deletedIncomes = await removeOutdatedIncome();
})

export default RemoveOutdatedIncomes