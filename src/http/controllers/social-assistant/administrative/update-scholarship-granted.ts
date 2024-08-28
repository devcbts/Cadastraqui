import { ScholarshipNotFoundError } from "@/errors/scholarship-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateScholarshipGranted(request: FastifyRequest, reply: FastifyReply){
    const requestParamsSchema = z.object({
        scholarship_id: z.string(),
    })
    const scholarshipBodySchema = z.object({
        type1TermAccepted: z.boolean(),
        type1DocumentReceived: z.boolean(),
        type2TermAccepted: z.boolean(),
        type2DocumentReceived: z.boolean(),
        gaveUp: z.boolean(),
        ScholarshipCode: z.string(),
    }).partial()

    const { scholarship_id } = requestParamsSchema.parse(request.params)
    const { type1TermAccepted, type1DocumentReceived, type2TermAccepted, type2DocumentReceived, gaveUp, ScholarshipCode } = scholarshipBodySchema.parse(request.body)
    try {
        const user_id: string = request.user.sub;
        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id,application:{SocialAssistant :{ user_id: user_id }} }
        })
        if (!scholarship) {
            throw new ScholarshipNotFoundError();
            
        }

        const newScholarshipInfo = await prisma.scholarshipGranted.update({
            where: { id: scholarship_id },
            data: {
                type1TermAccepted,
                type1DocumentReceived,
                type2TermAccepted,
                type2DocumentReceived,
                gaveUp,
                ScholarshipCode
            }
        })

        return reply.status(201).send({ scholarship: newScholarshipInfo })
    } catch (error) {
        if (error instanceof ScholarshipNotFoundError) {
            return reply.status(404).send({ message: error.message })
            
        }
        return reply.status(500).send({ message: 'Internal server error', error })
        
    }
}