import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function getEntityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
      const entity = await SelectEntityOrDirector(request.user.sub, request.user.role,{includeUser: true})

    return reply.status(200).send({ entity: { ...entity, ...entity?.user } })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
