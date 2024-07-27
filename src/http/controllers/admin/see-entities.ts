import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function seeEntities(
  request: FastifyRequest,
  reply: FastifyReply,

) {
  const requestParamsSchema = z.object({
    entity_id: z.string().optional()
  })
  const {entity_id} = requestParamsSchema.parse(request.params)
  try {
    const userId = request.user.sub
    const role = request.user.role


    if (!userId) {
      throw new NotAllowedError()
    }
    if (role !== 'ADMIN') {
        throw new NotAllowedError()
    }
    
    if(entity_id){
      const entity = await prisma.entity.findUnique({
        where: {id: entity_id},
        include: {
          Announcement: true,
          SocialAssistant: true,
          user: true
        }
      })

      return reply.status(200).send({entity})
    }

    const entities = await prisma.entity.findMany()

    return reply.status(200).send({entities})
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
