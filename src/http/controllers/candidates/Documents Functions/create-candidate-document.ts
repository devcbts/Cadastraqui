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
        const memberDocument = await tsPrisma.candidateDocuments.findFirst({
            where: {
                tableName,
                tableId
            }
        })
        if (memberDocument) {

            await tsPrisma.candidateDocuments.updateMany({
                where: {
                    tableName,
                    tableId

                },
                data: {
                    path: path,
                    metadata: metadata,
                    status: CandidateDocumentStatus.UPDATED,
                    expiresAt
                }
            })
        }
        else {
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
    }
    else {

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

}