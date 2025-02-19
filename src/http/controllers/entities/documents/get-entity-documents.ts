import { APIError } from "@/errors/api-error";
import { getUserEntity } from "@/utils/get-user-entity";
import { EntityDocumentType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getEntityLegalDocuments } from "../utils/document-type-handler";

export async function getEntityDocuments(req: FastifyRequest, res: FastifyReply) {

    try {
        const schema = z.object({
            type: z.enum(Object.values(EntityDocumentType) as [string, ...string[]])
        })
        console.log(req.params)
        const { data, success } = schema.safeParse(req.params)
        if (!success) {
            throw new APIError('Tipo de documento solicitado inválido')
        }
        console.log(req)
        const { type } = data
        const { sub: id, role } = req.user
        const entityId = await getUserEntity(id, role)
        if (!entityId) {
            throw new APIError('Instituição não encontrada')
        }
        const documents = await getEntityLegalDocuments(type as EntityDocumentType, entityId)
        return res.send({ documents })
    } catch (err) {
        if (err instanceof APIError) {
            return res.status(400).send({
                message: err.message
            })
        }
        console.log(err)
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}