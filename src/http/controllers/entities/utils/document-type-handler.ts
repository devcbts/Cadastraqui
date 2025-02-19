import { prisma } from "@/lib/prisma";
import { deleteFromS3Folder, getSignedUrlForFile } from "@/lib/S3";
import { EntityDocuments, EntityDocumentType, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
interface IHandlerArgs {
    db: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    type: EntityDocumentType,
    userId: string,
    path: string,
    fields?: Record<string, any>,
}
async function countDocument(args: IHandlerArgs) {
    return await args.db.entityDocuments.count({
        where: {
            AND: [{ entity_id: args.userId }, { type: args.type }]
        }
    })
}


export async function getEntityLegalDocuments(type: EntityDocumentType, userId: string) {
    const filter: Prisma.EntityDocumentsWhereInput[] = []
    switch (type) {
        case 'ACCOUNTING':
            filter.push({ fields: { path: ['year'], gt: (new Date().getFullYear() - 4) } })
            break;
        default:
            break
    }
    const docs = await prisma.entityDocuments.findMany({
        where: {
            AND: [{ entity_id: userId }, { type: type }, ...filter]
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
async function deleteFile(args: IHandlerArgs, file: EntityDocuments) {
    await deleteFromS3Folder(file.path)
    await args.db.entityDocuments.delete({
        where: { id: file.id }
    })
}

async function searchByField(args: IHandlerArgs, fieldName: string, value: any) {
    console.log(fieldName, value)
    return await args.db.entityDocuments.findFirst({
        where: {
            fields: {
                path: [fieldName],
                equals: value
            }
        }
    })
}
export async function documentTypeHandler(args: IHandlerArgs) {
    switch (args.type) {
        case 'RESPONSIBLE_CPF':
        case 'PROCURATION':
        case 'ELECTION_RECORD':
            if (await countDocument(args) === 2) {
                await deleteOldests(args, 1)
            }
            break;
        case 'ID_CARD':
            if (await countDocument(args) === 1) {
                await deleteOldests(args, 1)
            }
            break;
        case 'ACCOUNTING':
            const existingFile = await searchByField(args, 'year', args.fields!['year'])
            if (existingFile) {
                await deleteFile(args, existingFile)
            }
            break
    }
}