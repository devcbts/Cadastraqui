import { AllEducationType, EducationLevel, Prisma } from "@prisma/client";
import { normalizeString } from "./normalize-string";

export default async function createAnnouncementEducationLevel({
    dbClient,
    data
}: { dbClient: Prisma.TransactionClient, data: Omit<EducationLevel, "createdAt" | "updatedAt" | "id" | "courseId"> & { courseType: string, courseName: string, courseId: number | null } }) {
    if (data.entitySubsidiaryId) {
        const subsidiary = await dbClient.entitySubsidiary.findUnique({
            where: { id: data.entitySubsidiaryId }
        })
        if (!subsidiary) throw Error('Filial não encontrada')
    }
    let course = await dbClient.course.findFirst({
        where: { OR: [{ id: data.courseId ?? -1 }, { normalizedName: normalizeString(data.courseName) }] }
    })
    if (!course) {
        course = await dbClient.course.create({
            data: {
                name: data.courseName,
                Type: data.courseType as AllEducationType,
                normalizedName: normalizeString(data.courseName)
            }
        })
    }
    await dbClient.educationLevel.create({
        data: {
            announcementId: data.announcementId,
            level: data.level,
            typeOfScholarship: data.typeOfScholarship,
            entitySubsidiaryId: data.entitySubsidiaryId,
            shift: data.shift,
            verifiedScholarships: data.verifiedScholarships,
            semester: data.semester,
            type1Benefit: data.type1Benefit,
            courseId: course.id

        }
    })
}