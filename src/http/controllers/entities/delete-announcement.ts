import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteAnnouncement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    announcement_id: z.string().optional(),
  })

  const { announcement_id } = deleteParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub

    const entity = await prisma.entity.findUnique({
        where: {user_id}
    })
    if (!entity) {
        throw new NotAllowedError()
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id: announcement_id },
    })

    if (!announcement) {
      throw new ResourceNotFoundError()
    }

    if (announcement.entity_id !== entity.id) {
        throw new NotAllowedError()
    }

    await prisma.announcement.delete({ where: { id: announcement_id } })


    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
        return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
