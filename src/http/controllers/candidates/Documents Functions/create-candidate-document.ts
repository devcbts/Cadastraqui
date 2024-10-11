import { Prisma } from "@prisma/client";

export default async function createCandidateDocument(tsPrisma: Prisma.TransactionClient,
    path: string,
    metadata: Prisma.InputJsonValue,
    tableName: string,
    tableId: string,
    expiresAt: Date | null = null,

) {

    // if (tableName === "pix" || tableName === "registrato") {
    //     const memberDocument = await tsPrisma.candidateDocuments.findFirst({
    //         where: {
    //             tableName,
    //             tableId
    //         }
    //     })
    //     if (memberDocument) {

    //         await tsPrisma.candidateDocuments.updateMany({
    //             where: {
    //                 tableName,
    //                 tableId

    //             },
    //             data: {
    //                 path: path,
    //                 metadata: metadata,
    //                 status: CandidateDocumentStatus.UPDATED,
    //                 expiresAt
    //             }
    //         })
    //         return
    //     }



    await tsPrisma.candidateDocuments.upsert({
        where: {
            path
        },
        create: {

            path,
            metadata,
            tableName: tableName,
            tableId,
            expiresAt

        },
        update: {
            expiresAt,
            metadata
        }
    })
}
// await tsPrisma.candidateDocuments.create({
//     data: {
//         path,
//         metadata,
//         tableName: tableName,
//         tableId,
//         expiresAt
//     }
// })


// }