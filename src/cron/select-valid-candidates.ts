import { TiebreakerCriterias } from "@prisma/client"
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
                { field: 'CadUnico', value: TiebreakerCriterias.CadUnico, order: 'asc' },
                { field: 'AverageIncome', value: TiebreakerCriterias.LeastFamilyIncome, order: 'desc' },
                { field: 'hasSevereDesease', value: TiebreakerCriterias.SeriousIllness, order: 'desc' },
                // { field: 'Draw', value: TiebreakerCriterias.Draw, order: 'asc' },
            ]
            const fields = currentCriteria.map((e) => mapToFields.find((v) => v.value === e))
            const candidates = await prisma.identityDetails.findMany({
                orderBy: [
                    { [fields[0]!.field]: fields[0]!.order },
                    { [fields[1]!.field]: fields[1]!.order },
                    { [fields[2]!.field]: fields[2]!.order },
                    // { [fields[3]!.field]: fields[3]!.order },
                ],

            })
            candidates.forEach(async (candidate) => {

                // Get family members associated with current candidate
                const members = await prisma.familyMember.findMany({
                    where: { candidate_id: candidate.id }
                })
                // TODO: THIS MAY BE MOVED TO A NEW FILE (where actually register the income)
                // Get current income from the member

                const incomes = await prisma.familyMemberIncome.findMany({
                    where: {
                        OR: [
                            { candidate_id: { in: members.map(e => e.id) } },
                            { familyMember_id: { in: members.map(e => e.id) } }
                        ]
                    }
                })
                // Calculate averageIncome based on all members income
                const averageIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.averageIncome), 0)
                // Save average income to the identity details
                await prisma.identityDetails.update({
                    where: { candidate_id: candidate.id },
                    data: {
                        // averageIncome
                    }
                })
                const application = await prisma.application.findFirst({
                    where: {
                        AND: [
                            { candidate_id: candidate.id },
                            { announcement_id: announcement.id }
                        ]
                    }
                })
                // Loop over 'candidates' to update its position on Application table
                await prisma.application.update({
                    where: {
                        id: application!.id,
                    },
                    data: {
                        // Update user position
                    }
                })
            })

        })
    } catch (err) {
        console.log(err)
    }
}

selectValidCandidates()