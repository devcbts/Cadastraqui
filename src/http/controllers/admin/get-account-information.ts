import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAccountInformation(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        user_id: z.string()
    })

    try {
        const { user_id } = schema.parse(request.params)
        const user = await prisma.user.findUnique({
            where: { id: user_id },
            select: {
                role: true,
                loginHistory: { orderBy: { createdAt: "desc" }, take: 1 },
                _count: { select: { loginHistory: true } },
                createdAt: true,
                email: true,

            }
        })
        if (!user) {
            throw new APIError('Usuário não encontrado')
        }
        let additionalInfo = null
        switch (user.role) {
            case "ENTITY":
                additionalInfo = await prisma.entity.findUnique({
                    where: { user_id: user_id },
                    select: {
                        CNPJ: true,
                        address: true,
                        addressNumber: true,
                        city: true,
                        neighborhood: true,
                        UF: true,
                        phone: true
                    }
                })
                break;
            case "CANDIDATE":
            case "RESPONSIBLE":
                additionalInfo = await prisma.candidate.findUnique({
                    where: { user_id: user_id },
                })
            default:
                break;
        }
        const account = {
            ...user,
            accessCount: user._count.loginHistory,
            lastAccess: user.loginHistory?.[0]?.createdAt,
            details: additionalInfo
        }
        return response.status(200).send({ account })

    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}