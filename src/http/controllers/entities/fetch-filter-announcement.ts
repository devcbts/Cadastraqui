import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchFilterAnnouncements(
  request: FastifyRequest,
  reply: FastifyReply,

) {
  const fetchParamsSchema = z.object({
    page_number: z.number().optional(),
  })
  const querySchema = z.object({

    filter: z.enum(['open', 'subscription', 'finished']).optional()
  })

  const { page_number } = fetchParamsSchema.parse(request.params)

  const { filter } = querySchema.parse(request.query)
  console.log('passei aq')
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
    // filter will be on 'AND' expression
    let filterParams = [{}]
    if (filter) {
      const today = new Date()
      switch (filter) {
        case 'open':
          filterParams = [{ announcementBegin: { lte: today } }, { announcementDate: { gt: today } }]
          break
        case 'subscription':
          filterParams = [{ openDate: { lte: today } }, { closeDate: { gt: today } }]
          break
        case 'finished':
          filterParams = [{ announcementDate: { lte: today } }]
          break
      }
    }

    const currentDate = new Date()
    const pageSize = 10; // number of records per page
    const pageNumber = page_number || 1; // page number
    console.log(currentDate)
    const announcements = await prisma.announcement.findMany({
      where: {
        entity_id: entity.id,
        AND: filterParams
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
