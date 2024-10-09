import { Prisma } from "@prisma/client";

export default async function createCandidateDocument(tsPrisma: Prisma.TransactionClient,
    path: string,
    metadata: Prisma.InputJsonValue,
    tableName: string,
    tableId: string,
    expiresAt: Date | null = null,

) {

    if (tableName === "pix" || tableName === "registrato") {
        const documentExists = await tsPrisma.candidateDocuments.findFirst({
            where: {
                tableName,
                tableId
            }
        })
        if (documentExists) {
            await tsPrisma.candidateDocuments.update({
                where: {
                    id: documentExists?.id
                },
                data: {
                    path: path,
                    metadata: metadata,
                }
            })
            return
        }

    }

    await tsPrisma.candidateDocuments.create({
        data: {
            path,
            metadata,
            tableName: tableName,
            tableId,
            expiresAt
        }
    })

}