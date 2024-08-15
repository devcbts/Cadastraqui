import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCalls(request: FastifyRequest, reply: FastifyReply) {
    const getCallsParams = z.object({
        call_id: z.number().optional()
    })
    const { call_id } = getCallsParams.parse(request.params)
    try {
        const user_id = request.user.sub
        if (call_id) {
            const call= await prisma.call.findUnique({
                where: { id: call_id,creator_id: user_id },
                include:{
                    Messages: true
                }
            })
            if (!call) {
                throw new Error("Chamado não encontrado")
            }

            return reply.status(200).send({call})
        }
        const calls = await prisma.call.findMany({
            where: { creator_id: user_id },
          
        })

        return reply.status(200).send({calls})
    } catch (error: any) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message })
            
        }
        return reply.status(500).send({ message: error.message })
    }
}