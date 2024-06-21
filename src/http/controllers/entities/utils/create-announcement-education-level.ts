import { EducationLevel, Prisma } from "@prisma/client";

export default async function createAnnouncementEducationLevel({
    dbClient,
    data
}: { dbClient: Prisma.TransactionClient, data: EducationLevel }) {
    if (data.entitySubsidiaryId) {
        const subsidiary = await dbClient.entitySubsidiary.findUnique({
            where: { id: data.entitySubsidiaryId }
        })
        if (!subsidiary) throw Error('Filial não encontrada')
    }
    await dbClient.educationLevel.create({
        data
    })
}