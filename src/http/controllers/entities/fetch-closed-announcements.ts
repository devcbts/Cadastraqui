import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchClosedAnnouncements(
  request: FastifyRequest,
  reply: FastifyReply,

) {
  const fetchParamsSchema = z.object({
    page_number: z.number().optional()
  })

  const {page_number } = fetchParamsSchema.parse(request.params)
  try {
    const userId = request.user.sub
    if (!userId) {
      throw new NotAllowedError()
    }

    const entity = await prisma.entity.findUnique({
      where: { user_id: userId },
    })

    if (!entity) {
      throw new ResourceNotFoundError()
    }

    

    const currentDate = new Date()
    const pageSize = 6; // number of records per page
    const pageNumber = page_number || 1; // page number

    const announcements = await prisma.announcement.findMany({
      where: {
        entity_id: entity.id,
        announcementDate: { lte: currentDate }
      },
      include: {
        entity: true,
        entity_subsidiary: true
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    });

    return reply.status(200).send({ announcements, entity })
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
