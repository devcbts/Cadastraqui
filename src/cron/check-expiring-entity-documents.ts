import { Job, scheduleJob } from "node-schedule"
import { prisma } from "../lib/prisma"

export async function checkExpiringEntityDocuments() {
    try {
        const min = new Date()
        min.setMonth(min.getMonth() + 3)

        const singleDocuments = await prisma.entityDocuments.findMany({
            where: {
                expireAt: { gte: min },
                group: null
            }
        })
        const maxExpirePerGroup = await prisma.entityDocuments.groupBy({
            by: 'group',
            _max: {
                expireAt: true,
            },
            where: {
                expireAt: { gte: min },
                group: { not: null }
            },

        })
        const groupDocuments = await Promise.all(maxExpirePerGroup.map(async (groupData) => {
            return await prisma.entityDocuments.findFirst({
                where: {
                    group: groupData.group,
                    expireAt: groupData._max.expireAt,
                },
            })
        }
        ))

        console.log(groupDocuments.map(x => x?.id))
    } catch (err) {
        console.log(err)
    }
}

const CheckExpiringEntityDocuments: Job = scheduleJob("0 0 2 * * *", async () => {
    await checkExpiringEntityDocuments();
});

export default CheckExpiringEntityDocuments