import { Prisma as backupPrisma } from "backup_prisma/generated/clientBackup";

export async function createCandidateDocumentHDB(tsBackupPrisma: backupPrisma.TransactionClient,
    path: string,
    pathInMainDatabase: string,
    metadata: backupPrisma.InputJsonValue,
    tableName: string,
    tableId: string,
    expiresAt: Date | null = null,
    application_id: string

) {

    // if (tableName === "pix" || tableName === "registrato") {
    //     const hasDocument = await tsBackupPrisma.candidateDocuments.findFirst({
    //         where: {
    //             AND: [{ tableId }, { tableName }]
    //         }
    //     })
    //     if (hasDocument) {
    //     const memberDocument = await tsBackupPrisma.candidateDocuments.findFirst({
    //         where: {
    //             tableName,
    //             tableId
    //         }
    //     })

    //     if (memberDocument) {

    //         await tsBackupPrisma.candidateDocuments.updateMany({
    //             where: {
    //                 tableName,
    //                 tableId

    //             },
    //             data: {
    //                 path: path,
    //                 pathInMainDatabase: pathInMainDatabase,
    //                 metadata: metadata,
    //             }
    //         })
    //         return
    //     }
    //     else {
    //         await tsBackupPrisma.candidateDocuments.create({
    //             data: {
    //                 path,
    //                 metadata,
    //                 tableName: tableName,
    //                 pathInMainDatabase,
    //                 tableId,
    //                 expiresAt,
    //                 application_id
    //             }
    //         })
    //     }
    // }
    await tsBackupPrisma.candidateDocuments.upsert({
        where: { path },
        update: { path, pathInMainDatabase, expiresAt, metadata },
        create:
        {
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

export async function deleteCandidateDocumentHDB(backupPrisma: backupPrisma.TransactionClient,
    tableId: string,
    application_id: string,
    tableName: string,) {
    const candidateDocuments = await backupPrisma.candidateDocuments.findMany({
        where: {
            tableId,
            application_id,
            tableName
        },
        select: {
            path: true // Seleciona apenas o campo 'path'
        }
    });

    // Step 2: Extrair os dados de 'path'
    const paths = candidateDocuments.map(doc => doc.path);

    // Step 3: Deletar os documentos
    const deleteCandidateDocument = await backupPrisma.candidateDocuments.deleteMany({
        where: {
            tableId,
            application_id,
            tableName
        }
    });


}