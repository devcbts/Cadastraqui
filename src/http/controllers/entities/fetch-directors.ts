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
      const directors = await prisma.entityDirector.findMany({
        where: { entity_id: _id },
      })
      return reply.status(200).send({ directors })
    }
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
