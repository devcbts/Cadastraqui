import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function fetchSubsidiarys(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchSubsidiaryParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = fetchSubsidiaryParamsSchema.parse(request.params)
  try {
    const user_id = request.user.sub
    const role = request.user.role

    const entity = await SelectEntityOrDirector(user_id, role)

    let entitySubsidiarys
    if (!_id) {
      entitySubsidiarys = await prisma.entitySubsidiary.findMany({
        where: { entity_id: entity.id },
      })
    } else {
      entitySubsidiarys = await prisma.entitySubsidiary.findUnique({
        where: { id: _id },
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
