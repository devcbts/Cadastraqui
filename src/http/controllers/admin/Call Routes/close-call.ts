import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function closeCall(request: FastifyRequest, reply: FastifyReply) {
    const closeCallParams = z.object({
        call_id: z.string()
    })
    const { call_id } = closeCallParams.parse(request.params)
    try {
        const user_id = request.user.sub
        
        const call = await prisma.call.findUnique({
            where: { id: call_id, replyer_id: user_id }
        })
        if (!call) {
            throw new Error("Chamado não encontrado")
        }

        const updatedCall = await prisma.call.update({
            where: { id: call_id },
            data: {
                status: 'CLOSED'
            }
        })
        

        return reply.status(200).send({ updatedCall })
    } catch (error:any) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message })
            
        }
        return reply.status(500).send({ message: error.message })
    }
}