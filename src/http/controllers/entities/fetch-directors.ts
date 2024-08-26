import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function fetchDirectors(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getDirectorParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = getDirectorParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub
    const role = request.user.role

    const entity = await SelectEntityOrDirector(user_id, role)
    const directors = await prisma.entityDirector.findMany({
      where: { entity_id: entity.id },
      include: { user: { select: { email: true } } }
    })
    return reply.status(200).send({ directors: directors.map(e => ({ ...e, email: e.user.email })) })

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
