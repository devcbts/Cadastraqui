import { Application, CandidateApplicationStatus, Prisma, TiebreakerCriterias } from "@prisma/client";
import nodeSchedule from 'node-schedule';
import { prisma } from "../lib/prisma";
import dateToTimezone from "../utils/date-to-timezone";
// Change to promises to work in background
const selectValidCandidates = async () => {
    console.log('Starting to sort candidates')
    try {
        await prisma.$transaction(async (tsPrisma) => {

            const announcementsToValidate = await tsPrisma.announcement.findMany({
                where: {
                    AND: [
                        { closeDate: { lte: dateToTimezone(new Date()) } },
                        { sorted: false }
                    ]
                },
                include: {
                    educationLevels: true
                }
            })
            // Add some field on 'Application' table to define the current candidate position
            for (const announcement of announcementsToValidate) {
                for (const level of announcement.educationLevels) {


                    const currentCriteria = announcement.criteria
                    const mapToFields = [
                        { field: 'CadUnico', value: TiebreakerCriterias.CadUnico, order: 'DESC' },
                        { field: 'distance', value: TiebreakerCriterias.Distance, order: 'DESC' },
                        { field: 'averageIncome', value: TiebreakerCriterias.LeastFamilyIncome, order: 'ASC' },
                        { field: 'hasSevereDesease', value: TiebreakerCriterias.SeriousIllness, order: 'DESC' },
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

                    const applications = await tsPrisma.$queryRaw`
                SELECT * FROM "Application" 
                WHERE "announcement_id" = ${announcement.id} 
                -- AND "educationLevel_id" = ${level.id} 
                AND "position" IS NULL
                ORDER BY ${Prisma.raw(orderByExp)};
                ` as Application[]

                    await Promise.all(applications.map(async (application, index) => {
                        const currentPosition = index + 1
                        const currentStatus =
                            (currentPosition <= level.verifiedScholarships!)
                                ? CandidateApplicationStatus.Holder
                                : (announcement.waitingList
                                    ? CandidateApplicationStatus.WaitingList
                                    : null)
                        console.log(currentStatus, application.candidateName)
                        await tsPrisma.application.update({
                            where: {
                                id: application!.id
                            },
                            data: {
                                position: currentPosition,
                                candidateStatus: currentStatus
                            }
                        });
                    }));


                    // });

                    console.log('Candidates sorted successfully')
                }
                await tsPrisma.announcement.update({
                    where: { id: announcement.id },
                    data: {
                        sorted: true
                    }
                });
            }
            console.log("finalizado")
        })
    } catch (err) {
        console.log(err)
    }
}
// Schedule the selectValidCandidates function to run every 15 minutes
const Selectjob: nodeSchedule.Job = nodeSchedule.scheduleJob("0 */15 * * * *", async () => {
    const deletedIncomes = await selectValidCandidates();
})
export default Selectjob