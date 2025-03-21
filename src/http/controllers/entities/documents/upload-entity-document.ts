import { EntityDocuments, EntityDocumentType, Prisma } from ".prisma/client";
import { APIError } from "@/errors/api-error";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { getUserEntity } from "@/utils/get-user-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { documentTypeHandler, getEntityLegalDocuments } from "../utils/document-type-handler";
import signDocumentsHandler from "../utils/sign-documents-handler";
import processFiles from "./process-files";
export async function uploadEntityDocument(req: FastifyRequest, res: FastifyReply) {
    try {

        const { sub, role } = req.user
        const paramsSchema = z.object({
            groupId: z.string().optional()
        })
        const { groupId } = paramsSchema.parse(req.params)
        const parts = req.parts()
        const entityId = await getUserEntity(sub, role)
        if (!entityId) {
            throw new APIError('Instituição não encontrada')
        }
        const files = await processFiles(parts, { groupFile: !!groupId })
        const hasUniqueType = new Set(Object.values(files).map(x => x.type))
        if (hasUniqueType.size === 0 || hasUniqueType.size > 1) {
            throw new APIError('Apenas um tipo de arquivo permitido')
        }
        const fileType = Array.from(hasUniqueType)[0]!
        // get first document info to replicate on other documents if grouped
        let groupedFileInfo: EntityDocuments | null = null
        if (!!groupId) {
            groupedFileInfo = await prisma.entityDocuments.findFirst({
                where: { group: groupId }
            })
        }
        await prisma.$transaction(async (tPrisma) => {
            await Promise.all(Object.values(files).map(async file => {

                const { fields, buffer, metadata, type, name, group } = file
                const mergedFields = !!groupedFileInfo
                    ? { ...groupedFileInfo.fields as Object, ...fields }
                    : { ...(group && { group }), ...fields }
                let expireAt: null | Date = null;
                if (!!fields && "expireAt" in fields) {
                    expireAt = new Date(fields.expireAt as string)
                }
                const fn = async () => {
                    const identifier = randomUUID()
                    const path = `EntityDocuments/${entityId}/${type}/${identifier}-${name}`
                    const signKey = await signDocumentsHandler({
                        type,
                        userId: sub,
                        file: { buffer, name },
                        path,
                        metadata,
                        db: tPrisma
                    })
                    if (!groupId) {
                        await documentTypeHandler({
                            db: tPrisma,
                            type: EntityDocumentType[type as keyof typeof EntityDocumentType],
                            userId: entityId,
                            fields: file.fields,
                            path: path,
                        })
                    }
                    await tPrisma.entityDocuments.create({
                        data: {
                            name: name,
                            fields: mergedFields as Prisma.JsonObject,
                            metadata: metadata as Prisma.JsonObject,
                            type: type as EntityDocumentType,
                            entity_id: entityId,
                            user_id: sub,
                            path,
                            group: groupId ?? group,
                            expireAt,
                            signKey
                        }
                    })
                    const r = await uploadFile(buffer!, path, metadata)
                    console.log('upload', r)
                }
                return fn()
            }))
        })
        return res.status(201).send({ documents: await getEntityLegalDocuments(fileType, entityId) })
    } catch (error) {
        console.log(error)
        if (error instanceof APIError) {
            return res.status(400).send({
                message: error.message
            })
        }
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}