import { prisma } from "@/lib/prisma";
import { CallStatus, ROLE } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCalls(request: FastifyRequest, reply: FastifyReply) {
    const getCallsParams = z.object({
        call_id: z.string().optional(),
    });

    const getCallBody = z.object({
        role : z.nativeEnum(ROLE).optional(),
        page: z.number().int().default(1),
        pageSize: z.number().int().default(10),
        filter: z.nativeEnum(CallStatus).optional()
    })
    const { call_id } = getCallsParams.parse(request.params);
    const { role, page, pageSize ,filter} = getCallBody.parse(request.body);

    try {

        if (call_id) {
            const call = await prisma.call.findUnique({
                where: { id: call_id },
                include: {
                    Messages: true
                }
            });
            if (!call) {
                throw new Error("Chamado não encontrado");
            }

            return reply.status(200).send({ call });
        }

        const skip = (page - 1) * pageSize;
        const calls = await prisma.call.findMany({
            where: {
                creator: {
                    role: role ? role : { notIn: [ROLE.ADMIN] }
                },
                status: filter
            },
            skip: skip,
            take: pageSize
        });

        const totalCalls = calls.length;

        return reply.status(200).send({
            calls,
            pagination: {
                total: totalCalls,
                page,
                pageSize,
                totalPages: Math.ceil(totalCalls / pageSize)
            }
        });
    } catch (error: any) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: error.message });
    }
}