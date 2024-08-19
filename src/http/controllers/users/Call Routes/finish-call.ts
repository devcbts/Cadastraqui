import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function finishCall(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        id: z.string()
    })
    try {
        const { id } = schema.parse(request.body)
        const { sub } = request.user
        const call = await prisma.call.findUnique({
            where: { id }
        })
        if (!call || call.replyer_id !== sub || call.status === "CLOSED") {
            throw new APIError('Não é possível alterar o status desse chamado.')
        }
        await prisma.call.update({
            where: { id },
            data: {
                status: 'CLOSED'
            }
        })
        return response.status(204).send()
    } catch (err: any) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: err?.message })

    }
}