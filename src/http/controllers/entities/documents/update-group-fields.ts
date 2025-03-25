import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { getUserEntity } from "@/utils/get-user-entity";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateCommonGroupFields(req: FastifyRequest, res: FastifyReply) {
    try {
        const { sub, role } = req.user
        const entityId = await getUserEntity(sub, role)
        const schema = z.object({
            groupId: z.string().min(1, 'ID do grupo de documentos obrigatório')
        })
        const body = z.object({
            fields: z.record(z.any())
        })
        if (!entityId) {
            throw new APIError('Instituição não encontrada')
        }
        const { success, data } = schema.safeParse(req.params)
        const { success: b_success, data: b_data } = body.safeParse(req.body)
        if (!success || !b_success) {
            throw new APIError('Grupo ou campos de informação não fornecidos')
        }
        const group = await prisma.entityDocuments.findMany({
            where: {
                group: data.groupId
            }
        })
        if (group.length === 0) {
            throw new APIError('Grupo não encontrado')
        }
        await prisma.$transaction(async (tPrisma) => {
            await Promise.all(group.map(async x => {
                return prisma.entityDocuments.update({
                    where: { id: x.id },
                    data: {
                        fields: { ...x.fields as Object, ...b_data.fields } as Prisma.InputJsonValue
                    }
                })
            }))
        })
        return res.status(204).send()
    } catch (error) {
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