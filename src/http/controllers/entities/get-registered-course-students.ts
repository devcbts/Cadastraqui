import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getRegisteredStudentsByCourse(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        educationalLevel_id: z.string()
    })
    try {
        const { educationalLevel_id } = schema.parse(request.params)
        const course = await prisma.educationLevel.findUnique({
            where: { id: educationalLevel_id },
        })
        if (!course) {
            throw new APIError('Curso não encontrado')
        }
        const registered = await prisma.scholarshipGranted.findMany({
            where: { AND: [{ application: { educationLevel_id: educationalLevel_id } }, { status: "REGISTERED" }] },
        })
        return response.status(200).send({ registered })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }

        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}