import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { getUserEntity } from "@/utils/get-user-entity";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getExpiringDocuments(req: FastifyRequest, res: FastifyReply) {
    try {
        const { sub, role } = req.user
        const entityId = await getUserEntity(sub, role)
        const nextThree = new Date()
        nextThree.setMonth(nextThree.getMonth() + 3)
        const allTypes = await prisma.entityDocuments.groupBy({
            by: ['type'],
            where: {
                entity_id: entityId,
                expireAt: { gte: nextThree },
            },
            _count: {
                _all: true
            }
        })
        const documents = await Promise.all(allTypes.map(async (doc) => {
            const groupCount = await prisma.entityDocuments.findMany({
                distinct: 'group',
                where: {
                    entity_id: entityId,
                    expireAt: { gte: nextThree },
                    type: doc.type,
                    group: { not: null }
                },
                // distinct: 'group'
            });

            const totalWithoutGroup = await prisma.entityDocuments.count({
                where: {
                    entity_id: entityId,
                    expireAt: { gte: nextThree },
                    type: doc.type,
                    group: null
                }
            });

            return {
                type: doc.type,
                count: groupCount.length > 0 ? groupCount.length : totalWithoutGroup
            };
        }))
        return res.status(200).send({
            documents
        })
    } catch (err) {
        console.log(err)
        if (err instanceof APIError) {
            return res.status(400).send({
                message: err.message
            })
        }
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}