import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getType1Benefits(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestParamsSchema = z.object({
        educationLevel_id: z.string(),
    })

    const { educationLevel_id } = requestParamsSchema.parse(request.params)
    try {

        const type1Benefits = await prisma.type1Benefit.findMany({
            where: {
                educationLevel_id
            }
        }) 
      

        return reply.status(200).send({type1Benefits})
    } catch (error) {
       
        return reply.status(500).send({ message: 'Internal server error', error })
    }
}