import { EducationLevelNotFoundError } from "@/errors/education-level-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { type1Benefits } from '../enums/type1Benefits';

export default async function updateType1Benefits(request: FastifyRequest,
    reply: FastifyReply
) {

    const requestParamsSchema = z.object({
        educationLevel_id: z.string(),
    })

    const type1BenefitsSchema = z.array(z.object({
        type: type1Benefits,
        value: z.number()
    }))
    const benefits = type1BenefitsSchema.parse(request.body)
    const { educationLevel_id } = requestParamsSchema.parse(request.params)
    try {
        const educationLevel = await prisma.educationLevel.findUnique({
            where: {
                id: educationLevel_id
            },

        })
        if (!educationLevel) {
            throw new EducationLevelNotFoundError();
        }


        await prisma.$transaction(async (tsPrisma) => {

            for (const benefit of benefits) {
                await tsPrisma.type1Benefit.upsert({
                    where: { educationLevel_id_benefitType: { educationLevel_id, benefitType: benefit.type } },
                    create: {
                        value: benefit.value,
                        educationLevel_id: educationLevel_id,
                        benefitType: benefit.type

                    },
                    update: {
                        value: benefit.value
                    }
                })
            }
        })
        return reply.status(204).send()
    } catch (error) {
        if (error instanceof EducationLevelNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: 'Internal server error', error })
    }
}