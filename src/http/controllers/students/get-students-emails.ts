import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getStudentEmails(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const schema = z.object({
            student_id: z.string()
        })
        const { error, data } = schema.safeParse(request.params)
        if (error) {
            throw new APIError('Dados incorretos')
        }
        const { student_id } = data
        const emails = await prisma.studentEmail.findMany({
            where: { student_id }
        })
        return response.status(200).send({ emails })
    } catch (err) {
        if (err instanceof APIError) {

            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}