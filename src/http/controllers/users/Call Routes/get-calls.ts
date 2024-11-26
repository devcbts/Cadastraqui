import { GetUrl } from "@/http/services/get-file";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCalls(request: FastifyRequest, reply: FastifyReply) {
    const getCallsParams = z.object({
        call_id: z.string().optional()
    })
    const { call_id } = getCallsParams.parse(request.params)
    try {
        const user_id = request.user.sub
        if (call_id) {
            const call = await prisma.call.findUnique({
                where: { id: call_id, OR: [{ creator_id: user_id }, { replyer_id: user_id }] },
                include: {
                    Messages: {
                        orderBy: {
                            CreatedAt: "asc"
                        }
                    }
                }
            })

            if (!call) {
                throw new Error("Chamado não encontrado")
            }
            const attachements = await Promise.all(call.Messages.map(async e => {
                let url;
                if (e.filePath) {
                    url = await GetUrl(e.filePath)
                }
                return { ...e, url }
            }))
            return reply.status(200).send({ call: { ...call, Messages: attachements } })
        }
        const total = await prisma.call.count({
            where:
                { OR: [{ creator_id: user_id }, { replyer_id: user_id }] }
        })
        const calls = await prisma.call.findMany({
            where: { OR: [{ creator_id: user_id }, { replyer_id: user_id }] },

        })

        return reply.status(200).send({ calls, total })
    } catch (error: any) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: error.message })
    }
}