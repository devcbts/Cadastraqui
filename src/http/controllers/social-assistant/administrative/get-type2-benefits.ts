import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getType2Benefits(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestParamsSchema = z.object({
        scholarship_id: z.string(),
    })

    const { scholarship_id } = requestParamsSchema.parse(request.params)
    try {

        const scholarshipWithTypeTwoBenefits = await prisma.scholarshipGranted.findFirst({
            where: {
                id: scholarship_id
            },
            include: {
                type2Benefits: true
            }
        })

        return reply.status(200).send({ type2Benefits: scholarshipWithTypeTwoBenefits })
    } catch (error) {

        return reply.status(500).send({ message: 'Internal server error', error })
    }
}