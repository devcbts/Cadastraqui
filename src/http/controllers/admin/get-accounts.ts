import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAccounts(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        filter: z.union([z.literal("common"), z.literal("entities")])
    })
    try {
        const query = schema.safeParse(request.query)
        if (query.error) {
            throw new APIError("Filtro deve ser um desses: common, entities")
        }
        const { data: { filter } } = query
        let users;
        if (filter === "common") {
            users = await prisma.user.findMany({
                where: { role: { in: ["RESPONSIBLE", "CANDIDATE"] } },
                select: {
                    id: true,
                    role: true,
                    Candidate: { select: { name: true } },
                    LegalResponsible: { select: { name: true } },
                    isActive: true
                }

            })
            users = users.map(e => ({
                ...e, name: e.Candidate?.name ?? e.LegalResponsible?.name
            }))
        }
        if (filter === "entities") {
            users = await prisma.user.findMany({
                where: { role: { in: ["ENTITY"] } },
                select: {
                    id: true,
                    Entity: { select: { CNPJ: true, socialReason: true } },
                    isActive: true
                }
            })
            users = users.map(e => ({
                ...e,
                ...e.Entity
            }))
        }
        return response.status(200).send({ accounts: users })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}