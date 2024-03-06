import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchDirectors(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getDirectorParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = getDirectorParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub;
    if (_id || _id !== '') {
      const subsidiary = await prisma.entitySubsidiary.findUnique({
        where: { id: _id },
      })

      if (!subsidiary) {
        throw new ResourceNotFoundError()
      }
      const directors = await prisma.entityDirector.findMany({
        where: { entity_subsidiary_id: _id },
      })
      return reply.status(200).send({ directors })
    } else {
      const entity = await prisma.entity.findUnique({
        where: {user_id}
      })
      if (!entity) {
        throw new NotAllowedError()
      }
      const directors = await prisma.entityDirector.findMany({
        where: { entity_id: entity.id },
      })
      return reply.status(200).send({ directors })
    }
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
