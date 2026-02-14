import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { StudentImportBatchStatus } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import allowedUsersStudentRoutes from "./utils/allowed-users";

export default async function getStudentImportBatches(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub, role } = request.user
        const { user_id } = await allowedUsersStudentRoutes(sub, role)

        const querySchema = z.object({
            page: z.coerce.number().int().min(1).default(1),
            size: z.coerce.number().int().min(1).max(100).default(20),
            status: z.nativeEnum(StudentImportBatchStatus).optional(),
        })

        const { page, size, status } = querySchema.parse(request.query ?? {})

        const entity = await prisma.entity.findUnique({
            where: { user_id },
            select: { id: true }
        })

        if (!entity) {
            throw new APIError('Entidade não encontrada')
        }

        const where = {
            entity_id: entity.id,
            ...(status ? { status } : {})
        }

        const [total, batches] = await prisma.$transaction([
            prisma.studentImportBatch.count({ where }),
            prisma.studentImportBatch.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * size,
                take: size,
                select: {
                    id: true,
                    fileName: true,
                    delimiter: true,
                    status: true,
                    totalRows: true,
                    processedRows: true,
                    successRows: true,
                    errorRows: true,
                    startedAt: true,
                    finishedAt: true,
                    createdAt: true,
                    createdByUser: {
                        select: {
                            id: true,
                            email: true,
                        }
                    }
                }
            })
        ])

        return response.status(200).send({
            page,
            size,
            total,
            totalPages: Math.ceil(total / size),
            batches,
        })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }

        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}
