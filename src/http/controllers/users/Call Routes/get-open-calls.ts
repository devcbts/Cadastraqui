import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getOpenCalls(
    request: FastifyRequest,
    response: FastifyReply
) {

    try {
        // const { sub } = request.user
        const calls = await prisma.call.findMany({
            where: { status: 'OPEN' }
        })
        console.log(calls)
        return response.status(200).send({ calls })
    } catch (err: any) {
        return response.status(500).send({ message: err?.message })

    }
}