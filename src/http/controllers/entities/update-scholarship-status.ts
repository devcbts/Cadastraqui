import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { SCHOLARSHIP_GRANTED_STATUS } from "@/utils/enums/zod/scholarship-granted";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateScholarshipStatus(
    request: FastifyRequest,
    response: FastifyReply
) {
    const paramsSchema = z.object({
        scholarship_id: z.string()
    })
    const bodySchema = z.object({
        status: SCHOLARSHIP_GRANTED_STATUS
    })
    try {
        const { scholarship_id } = paramsSchema.parse(request.params)
        const { data, error } = bodySchema.safeParse(request.body)
        if (!!error) {
            throw new APIError('Status inválido')
        }
        const { status } = data
        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id }
        })
        if (!scholarship) {
            throw new APIError('Bolsista não encontrado')
        }
        if (scholarship.status !== "SELECTED") {
            throw new APIError('Esta bolsa já teve seu status modificado e não pode ser alterado novamente')
        }
        await prisma.scholarshipGranted.update({
            where: { id: scholarship_id },
            data: {
                status
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