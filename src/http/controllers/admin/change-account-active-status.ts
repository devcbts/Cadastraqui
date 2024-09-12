import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function changeAccountActiveStatus(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        user_id: z.string()
    })
    // const bodySchema = z.object({
    //     status: z.boolean()
    // })
    try {
        const { user_id } = schema.parse(request.params)
        // const { status } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!user) {
            throw new APIError("Usuário não encontrado")
        }
        await prisma.user.update({
            where: { id: user_id },
            data: {
                isActive: !user.isActive
            }
        })
        return response.status(204).send()
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}