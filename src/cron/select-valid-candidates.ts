import { Application, Prisma, TiebreakerCriterias } from "@prisma/client"
import { prisma } from "../lib/prisma"
// Change to promises to work in background
const selectValidCandidates = async () => {
    try {
        const announcementsToValidate = await prisma.announcement.findMany({
            where: {
                announcementDate: { lte: new Date() }
            }
        })
        // Add some field on 'Application' table to define the current candidate position
        announcementsToValidate.forEach(async (announcement) => {
            const currentCriteria = announcement.criteria
            const mapToFields = [
                { field: 'CadUnico', value: TiebreakerCriterias.CadUnico, order: 'DESC' },
                { field: 'averageIncome', value: TiebreakerCriterias.LeastFamilyIncome, order: 'ASC' },
                { field: 'hasSevereDesease', value: TiebreakerCriterias.SeriousIllness, order: 'ASC' },
                { field: 'RANDOM()', value: TiebreakerCriterias.Draw, order: '' },
            ]
            let fields = currentCriteria.map((e) => {
                const currField = mapToFields.find((v) => v.value === e)
                if (currField?.field === "RANDOM()") {
                    return `${currField?.field}`
                }
                return `"${currField?.field}" ${currField?.order}`.trim()
            })
            //Find where DRAW is
            const drawIndex = fields.findIndex(e => e.includes('RANDOM()'))
            if (drawIndex !== -1) {
                // Remove any other priority after 'draw'
                fields.splice(drawIndex + 1, fields.length - 1)
            }
            const orderByExp = fields.join(', ')

            const applications = await prisma.$queryRaw`
                SELECT * FROM "Application" 
                WHERE "announcement_id" = ${announcement.id} AND "position" IS NULL
                ORDER BY ${Prisma.raw(orderByExp)};
        ` as Application[]

            applications.forEach(async (application, index) => {

                // Loop over 'candidates' to update its position on Application table
                await prisma.application.update({
                    where: {
                        id: application!.id
                    },
                    data: {
                        position: index + 1
                    }
                })
            })

        })
    } catch (err) {
        console.log(err)
    }
}

export default selectValidCandidates()