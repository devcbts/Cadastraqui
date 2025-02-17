import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { getAwsFileFromFolder, getSignedUrlForFile } from "@/lib/S3";
import { getUserEntity } from "@/utils/get-user-entity";
import { EntityDocumentType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getEntityDocuments(req: FastifyRequest, res: FastifyReply) {

    try {
        const schema = z.object({
            type: z.enum(Object.values(EntityDocumentType) as [string, ...string[]])
        })
        const { data, success } = schema.safeParse(req.params)
        if (!success) {
            throw new APIError('Tipo de documento solicitado inválido')
        }
        console.log(req)
        const { type } = data
        const { sub: id, role } = req.user
        const entityId = await getUserEntity(id, role)
        const documents = await prisma.entityDocuments.findMany({
            where: {
                AND: [{ entity_id: entityId }, { type: type as EntityDocumentType }]
            }
        })
        const mappedDocuments = await Promise.all(documents.map(async document => {
            const url = await getSignedUrlForFile(document.path)

            return ({
                ...document, url
            })

        }))
        console.log('files', (await getAwsFileFromFolder(`EntityDocuments/d3aa914c-8f52-4383-b23b-ebe8ab0925c5/RESPONSIBLE_CPF`)).length)
        return res.send({ documents: mappedDocuments })
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