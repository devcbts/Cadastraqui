import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import getFilterParams from "@/utils/get-filter-params";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getAccounts(
    request: FastifyRequest,
    response: FastifyReply
) {


    try {
        const { filter, size, search, page } = getFilterParams(request.query, {
            filterOpts: ["common", "entities"]
        })

        let users;
        let total;
        if (filter === "common") {
            const query: Prisma.UserWhereInput = {
                AND: [
                    { role: { in: ["RESPONSIBLE", "CANDIDATE"] } },
                    (search ? { OR: [{ Candidate: { name: { contains: search, mode: "insensitive" } } }, { LegalResponsible: { name: { contains: search, mode: "insensitive" } } }] } : {})
                ]
            }
            total = await prisma.user.count({ where: query })
            users = await prisma.user.findMany({
                skip: page * size,
                take: size,
                where: query,
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
            const query: Prisma.UserWhereInput = {
                AND: [
                    { role: { in: ["ENTITY"] } },
                    (search ? { Entity: { socialReason: { contains: search, mode: "insensitive" } } } : {})

                ]
            }
            total = await prisma.user.count({ where: query })
            users = await prisma.user.findMany({
                where: query,
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
        return response.status(200).send({ accounts: users, total })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}