import { APIError } from "@/errors/api-error";
import { deleteFile } from "@/http/services/delete-file";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { getSignedUrlForFile } from "@/lib/S3";
import { getUserEntity } from "@/utils/get-user-entity";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import processFiles from "./process-files";

export default async function updateEntityDocument(req: FastifyRequest, res: FastifyReply) {
    try {

        const { sub, role } = req.user
        const parts = req.parts()
        const entityId = await getUserEntity(sub, role)
        const paramsSchema = z.object({
            id: z.string()
        })
        const { id } = paramsSchema.parse(req.params)
        if (!entityId) {
            throw new APIError('Instituição não encontrada')
        }
        const files = await processFiles(parts, { isUpdate: true })
        let updated: Record<string, any> = {}
        await prisma.$transaction(async (tPrisma) => {
            await Promise.all(Object.values(files).map(async file => {

                const { fields, buffer, metadata, type, name, group } = file
                const fn = async () => {
                    const doc = await tPrisma.entityDocuments.findUniqueOrThrow({
                        where: { id }
                    })
                    const newMetadata = { ...doc.metadata as Object, ...metadata ?? {} }
                    const newFields = { ...doc.fields as Object, ...fields ?? {} }
                    let path
                    if (buffer) {
                        path = `EntityDocuments/${entityId}/${doc.type}/${randomUUID()}-${name}`
                        await deleteFile(doc?.path)
                        await uploadFile(buffer, path, newMetadata)
                    }
                    // await documentTypeHandler({
                    //     db: tPrisma,
                    //     type: EntityDocumentType[type as keyof typeof EntityDocumentType],
                    //     userId: entityId,
                    //     fields: file.fields,
                    //     path: path,
                    // })
                    updated = await tPrisma.entityDocuments.update({
                        where: { id },
                        data: {
                            name,
                            fields: newFields as Prisma.JsonObject,
                            metadata: newMetadata as Prisma.JsonObject,
                            // type: type as EntityDocumentType,
                            // entity_id: entityId,
                            user_id: sub,
                            path,
                            // group
                        }
                    })


                }
                return fn()
            }))
        })
        return res.status(201).send({ ...updated, url: await getSignedUrlForFile(updated.path) })
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