import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { StudentImportItemStatus } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import allowedUsersStudentRoutes from "./utils/allowed-users";

export default async function getStudentImportBatchItems(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub, role } = request.user
        const { user_id } = await allowedUsersStudentRoutes(sub, role)

        const paramsSchema = z.object({
            batch_id: z.string().uuid(),
        })

        const querySchema = z.object({
            page: z.coerce.number().int().min(1).default(1),
            size: z.coerce.number().int().min(1).max(200).default(50),
            onlyErrors: z.preprocess((val) => {
                if (typeof val === 'string') {
                    const v = val.toLowerCase().trim()
                    if (v === 'true' || v === '1') return true
                    if (v === 'false' || v === '0' || v === '') return false
                }
                if (typeof val === 'number') return val === 1
                if (typeof val === 'boolean') return val
                return false
            }, z.boolean().default(false)),
        })

        const { batch_id } = paramsSchema.parse(request.params ?? {})
        const { page, size, onlyErrors } = querySchema.parse(request.query ?? {})

        const entity = await prisma.entity.findUnique({
            where: { user_id },
            select: { id: true }
        })

        if (!entity) {
            throw new APIError('Entidade não encontrada')
        }

        const batch = await prisma.studentImportBatch.findFirst({
            where: { id: batch_id, entity_id: entity.id },
            select: { id: true }
        })

        if (!batch) {
            throw new APIError('Lote de importação não encontrado')
        }

        const statusFilter = onlyErrors
            ? { status: StudentImportItemStatus.ERROR }
            : { status: { in: [StudentImportItemStatus.CREATED, StudentImportItemStatus.SKIPPED, StudentImportItemStatus.ERROR] } }

        const where = {
            batch_id,
            ...statusFilter,
        }

        console.debug('getStudentImportBatchItems where=', where)

        const [total, items] = await prisma.$transaction([
            prisma.studentImportBatchItem.count({ where }),
            prisma.studentImportBatchItem.findMany({
                where,
                orderBy: { lineNumber: 'asc' },
                skip: (page - 1) * size,
                take: size,
                select: {
                    id: true,
                    lineNumber: true,
                    status: true,
                    errorMessage: true,
                    rawData: true,
                    candidateCpf: true,
                    candidateEmail: true,
                    candidate_id: true,
                    student_id: true,
                    createdAt: true,
                }
            })
        ])

        return response.status(200).send({
            page,
            size,
            total,
            totalPages: Math.ceil(total / size),
            items,
        })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }

        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}
