import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchEntitySubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub

    if (!userId) {
      throw new NotAllowedError()
    }

    const entity = await prisma.entity.findUnique({
      where: { user_id: userId },
    })

    if (!entity) {
      throw new EntityNotExistsError()
    }

    const entitySubsidiarys = await prisma.entitySubsidiary.findMany({
      where: { entity_id: entity.id },
    })

    return reply.status(200).send({ entitySubsidiarys })
  } catch (err: any) {
    if (err instanceof EntityNotExistsError) {
      return reply.status(404).send({ err: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ err: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
