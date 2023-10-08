import { EntityMatrixNotExistsError } from '@/errors/entity-matrix-not-exists-errror'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchEntitySubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchSubsidiarySchema = z.object({
    entity_matrix_id: z.string(),
  })

  const { entity_matrix_id } = fetchSubsidiarySchema.parse(request.params)

  try {
    const entityMatrix = await prisma.entityMatrix.findUnique({
      where: { id: entity_matrix_id },
    })

    if (!entityMatrix) {
      throw new EntityMatrixNotExistsError()
    }

    const entitySubsidiarys = await prisma.entitySubsidiary.findMany({
      where: { entity_matrix_id },
    })

    return reply.status(200).send({ entitySubsidiarys })
  } catch (err: any) {
    if (err instanceof EntityMatrixNotExistsError) {
      return reply.status(404).send({ err: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
