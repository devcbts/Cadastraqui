import { ScholarshipNotFoundError } from "@/errors/scholarship-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateType2Benefits(request: FastifyRequest,reply: FastifyReply){
    
    const requestParmsSchema = z.object({
        scholarship_id: z.string(),
    })

    const updateParamsSchema = z.object({
        value: z.number(),
        description: z.string(),
    })

    const { scholarship_id } = requestParmsSchema.parse(request.params);

    const { value, description } = updateParamsSchema.parse(request.body);

    try {
        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id }
        })

        if (!scholarship) {
            throw new ScholarshipNotFoundError
        }

        const type2Benefit = await prisma.type2Benefit.findFirst({
            where: { scholarshipGrantedId: scholarship_id }
        })

        if (!type2Benefit) {
            throw new Error('Benefício não encontrado')
        }

        await prisma.type2Benefit.update({
            where: { id: type2Benefit.id },
            data: {
                value,
                description
            }
        })

        return reply.status(200).send({ message: 'Dados atualizados com sucesso' })
    } catch (error) {
        if (error instanceof ScholarshipNotFoundError) {
            return reply.status(404).send({ message: error.message })
        }
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message })
            
        }
        return reply.status(500).send({ message: 'Internal server error', error })
    }
}