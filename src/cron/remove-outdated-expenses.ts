import nodeSchedule from 'node-schedule';
import { prisma } from '../lib/prisma';

async function removeOutdatedExpenses() {
    const deletedIncomes: any[] = []; // Passo 1
    try {
        const uniqueGroups = await prisma.expense.findMany({
            distinct: ['candidate_id', 'legalResponsibleId']
        });

        for (const group of uniqueGroups) {
            const oldestExpense = await prisma.expense.findFirst({
                where: {
                    candidate_id: group.candidate_id,
                },
                orderBy: {
                    date: 'asc'
                },
            });

            if (oldestExpense) {
                const deleted = await prisma.expense.delete({
                    where: {
                        id: oldestExpense.id
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

//Runs every day 1 of the month at 2 AM, same as RemoveOutdatedIncomes
const RemoveOutdatedExepenses: nodeSchedule.Job = nodeSchedule.scheduleJob("0 0 2 1 * * ", async () => {
    const deletedIncomes = await removeOutdatedExpenses();
})

export default RemoveOutdatedExepenses