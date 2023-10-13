import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchEntities(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchEntitiesParamsSchema = z.object({
    entity_id: z.string().optional(),
  })

  const { entity_id } = fetchEntitiesParamsSchema.parse(request.params)

  try {
    let entities
    if (!entity_id) {
      entities = await prisma.entity.findMany()
    } else {
      entities = await prisma.entity.findUnique({
        where: { id: entity_id },
      })
    }

    return reply.status(200).send({ entities })
  } catch (err: any) {
    return reply.status(500).send({ message: err.message })
  }
}
