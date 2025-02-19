import { prisma } from "@/lib/prisma";
import { deleteFromS3Folder, getSignedUrlForFile } from "@/lib/S3";
import { EntityDocumentType, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
interface IHandlerArgs {
    db: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    type: EntityDocumentType,
    userId: string
}
async function countDocument(args: IHandlerArgs) {
    return await args.db.entityDocuments.count({
        where: {
            AND: [{ entity_id: args.userId }, { type: args.type }]
        }
    })
}


export async function getEntityLegalDocuments(type: EntityDocumentType, userId: string) {
    const docs = await prisma.entityDocuments.findMany({
        where: {
            AND: [{ entity_id: userId }, { type: type }]
        }
    })
    const mappedDocuments = await Promise.all(docs.map(async document => {
        const url = await getSignedUrlForFile(document.path)

        return ({
            ...document, url
        })

    }))
    return mappedDocuments
}
async function deleteOldests(args: IHandlerArgs, count: number) {
    const docs = await args.db.entityDocuments.findMany({
        where: {
            AND: [{ entity_id: args.userId }, { type: args.type }]
        },
        orderBy: { createdAt: 'asc' },
        take: count
    })
    await Promise.all(docs.map(async doc => {
        await deleteFromS3Folder(doc.path)
        await args.db.entityDocuments.delete({
            where: { id: doc.id }
        })
    }))
}
export async function documentTypeHandler(args: IHandlerArgs) {
    switch (args.type) {
        case 'RESPONSIBLE_CPF':
        case 'PROCURATION':
        case 'ELECTION_RECORD':
            if (await countDocument(args) > 2) {
                await deleteOldests(args, 1)
            }
            break;
        case 'ID_CARD':
            if (await countDocument(args) > 1) {
                await deleteOldests(args, 1)
            }
            break;

    }
}