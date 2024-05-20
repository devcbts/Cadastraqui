import nodeSchedule from 'node-schedule'
import { prisma } from '../lib/prisma'

async function removeOutdatedIncome() {
    try {
        const incomes = await prisma.monthlyIncome.findMany({
            select: {
                id: true,
                incomeSource: true,
                date: true,
                candidate_id: true,
                familyMember_id: true
            },
            orderBy: {
                date: 'asc'
            },
            distinct: ['familyMember_id', 'candidate_id', 'incomeSource']
        })
        await prisma.monthlyIncome.deleteMany({
            where: {
                id: { in: incomes.map(e => e.id) }
            }
        })
    } catch (err) {

    }
}

// Run this job every day 1 of the month
const job: nodeSchedule.Job = nodeSchedule.scheduleJob("* * * 1 * * *", async () => await removeOutdatedIncome())
console.log('executing')
removeOutdatedIncome()
console.log('finish')
export default job
