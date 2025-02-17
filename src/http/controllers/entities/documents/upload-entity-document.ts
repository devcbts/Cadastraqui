import { EntityDocumentType, Prisma, ROLE } from ".prisma/client";
import { APIError } from "@/errors/api-error";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { getUserEntity } from "@/utils/get-user-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { buffer } from "node:stream/consumers";
import { z } from "zod";
import { documentTypeHandler, getEntityLegalDocuments } from "../utils/document-type-handler";
export async function uploadEntityDocument(req: FastifyRequest, res: FastifyReply) {
    try {
        const { sub, role } = {
            sub: '7d5fe1da-ea1e-485d-883a-28b224ec68b9',
            role: 'ENTITY' as ROLE
        }
        const parts = req.parts()
        const entityId = await getUserEntity(sub, role)
        if (!entityId) {
            throw new APIError('Instituição não encontrada')
        }
        const files: Record<string, {
            buffer?: Buffer,
            fields?: object,
            metadata?: object,
            type?: EntityDocumentType,
            name?: string
        }> = {}
        const schema = z.object({
            buffer: z.instanceof(Buffer, { message: 'Arquivo obrigatório' }).refine(v => v?.length !== 0, 'Arquivo obrigatório'),
            name: z.string().optional(), // if not present, means file (buffer) is null
            metadata: z.object({
                type: z.string().min(1, 'Tipo obrigatório'),
                category: z.string().optional()
            }).refine((v) => !!v, 'Metadata obrigatório'),
            fields: z.object({}).optional(),
            type: z.enum(Object.values(EntityDocumentType) as [string, ...string[]]),

        })
        for await (const part of parts) {
            const index = part.fieldname.split('_').pop()
            if (!index) {
                continue
            }
            if (!files[index]) {
                files[index] = {
                }
            }
            const { type, mimetype } = part
            if (type === 'file') {
                files[index].buffer = await buffer(part.file)
                files[index].name = part.filename
            } else if (part.type === 'field') {
                if (!!part.fieldname.match(/^metadata_(\d+)$/)) {
                    // validar o metadata baseado no tipo
                    files[index].metadata = JSON.parse(part.value as string)
                }
                if (!!part.fieldname.match(/^fields_(\d+)$/)) {
                    // validar os fields baseado no tipo
                    files[index].fields = JSON.parse(part.value as string)
                }
                if (!!part.fieldname.match(/^type_(\d+)$/)) {
                    // validar os fields baseado no tipo
                    files[index].type = part.value as EntityDocumentType
                }
            }

        }

        await prisma.$transaction(async (tPrisma) => {
            await Promise.all(Object.values(files).map(async file => {
                console.log(file)
                const { success, data, error } = schema.safeParse(file)
                if (!success) {
                    throw new APIError(error.issues.map(e => e.message).join(','))
                }
                const { fields, buffer, metadata, type, name } = data
                const fn = async () => {
                    const path = `EntityDocuments/${entityId}/${type}/${Date.now()}-${name}`
                    await uploadFile(buffer!, `EntityDocuments/${entityId}/${type}/${Date.now()}-${name}`, metadata)
                    await tPrisma.entityDocuments.create({
                        data: {
                            fields: fields as Prisma.JsonObject,
                            metadata: metadata as Prisma.JsonObject,
                            type: type as EntityDocumentType,
                            entity_id: entityId,
                            user_id: sub,
                            path
                        }
                    })
                    await documentTypeHandler({ db: tPrisma, type: file.type!, userId: entityId })
                }
                return fn()
            }))
        })
        return res.status(201).send({ documents: await getEntityLegalDocuments(files?.[0]?.type!, entityId) })
    } catch (error) {
        if (error instanceof APIError) {
            return res.status(400).send({
                message: error.message
            })
        }
        console.log(error)
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}