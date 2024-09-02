import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getScholarshipsByLevel(request: FastifyRequest, reply: FastifyReply) {
    const requestParamsSchema = z.object({
        educationLevel_id: z.string(),
    })

    const { educationLevel_id } = requestParamsSchema.parse(request.params)
    try {

        const scholarships = await prisma.scholarshipGranted.findMany({
            where: {
                application: { educationLevel_id }
            },
            include: {
                application: {
                    select: {
                        id: true,
                        candidateStatus: true,
                        position: true
                    }
                }
            }
        })


        return reply.status(200).send({ scholarships })
    } catch (error) {

        return reply.status(500).send({ message: 'Internal server error', error })
    }
}