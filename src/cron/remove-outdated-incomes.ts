import nodeSchedule from 'node-schedule';
import { prisma } from '../lib/prisma';

async function removeOutdatedIncome() {
    const deletedIncomes = []; // Passo 1
    try {
        const uniqueGroups = await prisma.monthlyIncome.findMany({
            select: {
                familyMember_id: true,
                candidate_id: true,
                incomeSource: true,
            },
            distinct: ['familyMember_id', 'candidate_id', 'legalResponsibleId', 'incomeSource']
        });

        for (const group of uniqueGroups) {
            const oldestIncome = await prisma.monthlyIncome.findFirst({
                where: {
                    familyMember_id: group.familyMember_id,
                    candidate_id: group.candidate_id,
                    incomeSource: group.incomeSource,
                },
                orderBy: {
                    date: 'asc'
                },
            });

            if (oldestIncome) {
                const deleted = await prisma.monthlyIncome.delete({
                    where: {
                        id: oldestIncome.id
                    }
                });
                deletedIncomes.push(deleted); // Passo 2
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