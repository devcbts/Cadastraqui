import { Prisma as backupPrisma } from "backup_prisma/generated/clientBackup";

export default async function createCandidateDocumentHDB(tsBackupPrisma: backupPrisma.TransactionClient,
    path: string,
    pathInMainDatabase: string,
    metadata: backupPrisma.InputJsonValue,
    tableName: string,
    tableId: string,
    expiresAt: Date | null = null,
    application_id : string

) {

    if (tableName === "pix" || tableName === "registrato") {
        await tsBackupPrisma.candidateDocuments.updateMany({
            where: {
                tableName,
                tableId

            },
            data: {
                path: path,
                pathInMainDatabase: pathInMainDatabase,
                metadata: metadata,
            }
        })
    }
    await tsBackupPrisma.candidateDocuments.create({
        data: {
            path,
            metadata,
            tableName: tableName,
            pathInMainDatabase,
            tableId,
            expiresAt,
            application_id
        }
    })

}