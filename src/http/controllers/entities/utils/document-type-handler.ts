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
async function countGroups(args: IHandlerArgs) {
    const groups = await args.db.entityDocuments.groupBy({
        by: 'group',
        where: {
            AND: [{ entity_id: args.userId }, { type: args.type }]
        },
    })
    return groups.length
}


export async function getEntityLegalDocuments(type: EntityDocumentType, userId: string) {
    const filter: Prisma.EntityDocumentsWhereInput[] = []
    switch (type) {
        case 'ACCOUNTING':
        case 'AUDIT_OPINION':
        case 'PARTNERSHIP_TERM':
        case 'ACTIVITY_REPORT':
        case 'NOMINAL_RELATION':
        case 'NOMINAL_RELATION_TYPE_ONE':
        case 'NOMINAL_RELATION_TYPE_TWO':
        case 'PROFILE_ANALYSIS':
        case 'GOVERNING_BODY':
        case 'ANNOUNCEMENT':
            filter.push({ fields: { path: ['year'], gt: (new Date().getFullYear() - 4) } })
            break;
        case 'ACCREDITATION_ACT':
        case 'CEBAS':
            filter.push({
                AND: [
                    { metadata: { path: ['document'], not: Prisma.DbNull } },
                    { group: { not: null } }
                ]
            })
        default:
            break
    }
    const docs = await prisma.entityDocuments.findMany({
        where: {
            AND: [{ entity_id: userId }, { type: type }, ...filter]
        },
        include: {
            User: {
                select: {
                    Entity: { select: { socialReason: true } },
                    EntityDirector: { select: { name: true } },
                    Lawyer: { select: { name: true } },
                    SocialAssistant: { select: { name: true } },
                    EntitySubsidiary: { select: { socialReason: true } }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const mappedDocuments = await Promise.all(docs.map(async document => {
        const url = await getSignedUrlForFile(document.path)
        const { Entity, EntityDirector, EntitySubsidiary, Lawyer, SocialAssistant } = document.User
        const sentBy = Entity?.socialReason || EntityDirector?.name || EntitySubsidiary?.socialReason || Lawyer?.name || SocialAssistant?.name
        return ({
            ...document, url, sentBy
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
async function deleteOldestGroup(args: IHandlerArgs) {
    const oldestGroup = await args.db.entityDocuments.findFirst({
        where: {
            AND: [{ entity_id: args.userId }, { type: args.type }]
        },
        orderBy: { createdAt: 'asc' },
    })
    console.log('OLDEST GROUP', oldestGroup?.group)
    const docs = await args.db.entityDocuments.findMany({
        where: {
            group: oldestGroup?.group
        }
    })
    await Promise.all(docs.map(async doc => {
        await deleteFromS3Folder(doc.path)
    }))
    await args.db.entityDocuments.deleteMany({
        where: { group: oldestGroup?.group }
    })
}
async function deleteFile(args: IHandlerArgs, file: EntityDocuments) {
    await deleteFromS3Folder(file.path)
    await args.db.entityDocuments.delete({
        where: { id: file.id }
    })
}

async function searchByField(args: IHandlerArgs, fieldName: string, value: any) {
    return await args.db.entityDocuments.findFirst({
        where: {
            AND: [
                { entity_id: args.userId }, { type: args.type },
                {
                    fields: {
                        path: [fieldName],
                        equals: value
                    }
                }
            ]
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
        case 'PUBLIC_DEED':
        case 'CHARITABLE_CERTIFICATE':
            if (await countDocument(args) === 1) {
                await deleteOldests(args, 1)
            }
            break;
        case 'ACCOUNTING':
        case 'AUDIT_OPINION':
        case 'PARTNERSHIP_TERM':
        case 'ACTIVITY_REPORT':
        case 'NOMINAL_RELATION':
        case 'NOMINAL_RELATION_TYPE_ONE':
        case 'NOMINAL_RELATION_TYPE_TWO':
        case 'PROFILE_ANALYSIS':
        case 'GOVERNING_BODY':
        case 'MONITORING_REPORT':
        case 'CLARIFICATION_REQUEST':
            const existingFile = await searchByField(args, 'year', args.fields!['year'])
            if (existingFile) {
                await deleteFile(args, existingFile)
            }
            break
        case "CEBAS":
            if (await countGroups(args) === 2) {
                await deleteOldestGroup(args)
            }
            break;
        case 'MONTHLY_REPORT':
            const exist = await args.db.entityDocuments.findFirst({
                where: {
                    AND: [
                        { entity_id: args.userId }, { type: args.type },
                        {

                            fields: {
                                path: ['year'],
                                equals: args.fields!['year']
                            }
                        },
                        {
                            fields:
                            {
                                path: ['month'],
                                equals: args.fields!['month']
                            }
                        }
                    ]
                }
            })
            if (exist) {
                await deleteFile(args, exist)
            }
        default:
            break
    }
}