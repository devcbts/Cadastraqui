import { APIError } from '@/errors/api-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function getEntityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { user_id } = await SelectEntityOrDirector(request.user.sub, request.user.role)
    const entity = await prisma.entity.findUnique({
      where: { user_id },
      include: {
        EntitySubsidiary: true,
        user: {
          select: {
            email: true,
            isActive: true,
            role: true,
            id: true
          }
        }
      }
    })
    if (!entity) {
      throw new APIError('Entidade não encontrada')
    }
    return reply.status(200).send({ entity: { ...entity, entity_id: entity.id, ...entity?.user } })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
