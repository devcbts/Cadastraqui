import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getEntityMatrix(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMatrixSchema = z.object({
    entity_id: z.string(),
  })

  const { entity_id } = getMatrixSchema.parse(request.params)

  try {
    const entity = await prisma.entity.findUnique({ where: { id: entity_id } })

    if (!entity) {
      throw new EntityNotExistsError()
    }

    const entityMatrix = await prisma.entityMatrix.findUnique({
      where: { entity_id },
    })

    return reply.status(200).send({ entityMatrix })
  } catch (err: any) {
    if (err instanceof EntityNotExistsError) {
      return reply.status(404).send({ err: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
