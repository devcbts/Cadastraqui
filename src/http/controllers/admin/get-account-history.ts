import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAccountHistory(
    request: FastifyRequest,
    response: FastifyReply,
) {
    const schema = z.object({
        user_id: z.string()
    })
    const query = z.object({
        filter: z.union([z.literal('sac'), z.literal('login')])
    })

    try {
        const { user_id } = schema.parse(request.params)
        const params = query.safeParse(request.query)

        if (params.error) {
            throw new APIError("Filtro deve ser um desses: sac, login")
        }
        const { data: { filter } } = params
        const user = await prisma.user.findUnique({
            where: { id: user_id },
            select: {

                loginHistory: filter === "login" && { orderBy: { createdAt: "desc" } },
                createdCalls: filter === "sac" && { orderBy: { CreatedAt: "desc" } },
                repliedCalls: filter === "sac" && { orderBy: { CreatedAt: "desc" } }
            }

        })
        if (!user) {
            throw new APIError("Usuário não encontrado")
        }
        const history =
            filter === "sac"
                ? [...user.createdCalls, ...user.repliedCalls]
                : user.loginHistory
        console.log(user)
        return response.status(200).send({ history })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}