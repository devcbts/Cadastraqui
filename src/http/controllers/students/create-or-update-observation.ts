import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function createOrUpdateStudentObservation(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const schema = z.object({
            student_id: z.string(),
            richText: z.string(),
            plainText: z.string()
        })
        const { error, data } = schema.safeParse(request.body)
        if (!!error) {
            throw new APIError('Dados incorretos')
        }
        const { student_id, plainText, richText } = data
        await prisma.studentObservation.upsert({
            where: {
                student_id
            },
            create: {
                plainText,
                richText,
                student_id
            },
            update: {
                plainText,
                richText
            }
        })

        return response.status(204).send()
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}