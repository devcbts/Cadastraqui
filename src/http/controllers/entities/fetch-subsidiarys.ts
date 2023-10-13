import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchSubsidiarys(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchSubsidiaryParamsSchema = z.object({
    subsidiary_id: z.string().optional(),
  })

  const { subsidiary_id } = fetchSubsidiaryParamsSchema.parse(request.params)
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

    let entitySubsidiarys
    if (!subsidiary_id) {
      entitySubsidiarys = await prisma.entitySubsidiary.findMany({
        where: { entity_id: entity.id },
      })
    } else {
      entitySubsidiarys = await prisma.entitySubsidiary.findUnique({
        where: { id: subsidiary_id },
      })
    }

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
