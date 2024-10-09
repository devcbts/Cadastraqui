import { CandidateDocumentStatus, Prisma } from "@prisma/client";
import { section } from '../AWS Routes/upload-documents';

export default async function createCandidateDocument(tsPrisma: Prisma.TransactionClient,
    path: string,
    metadata: Prisma.InputJsonValue,
    tableName: string,
    tableId: string,
    expiresAt: Date | null = null,

) {

    if (tableName === "pix" || tableName === "registrato") {
        await tsPrisma.candidateDocuments.updateMany({
            where: {
                tableName,
                tableId

            },
            data: {
                path: path,
                metadata: metadata,
            }
        })
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