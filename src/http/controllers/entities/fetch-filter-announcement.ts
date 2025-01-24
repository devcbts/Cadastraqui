import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import getFilterParams from '@/utils/get-filter-params'
import { Prisma } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function fetchFilterAnnouncements(
  request: FastifyRequest,
  reply: FastifyReply,

) {
  // const fetchParamsSchema = z.object({
  //   page_number: z.number().optional(),
  // })
  // const querySchema = z.object({

  //   filter: z.enum(['scheduled', 'open', 'subscription', 'finished']).optional()
  // })

  // const { page_number } = fetchParamsSchema.parse(request.params)

  // const { filter } = querySchema.parse(request.query)

  const {
    filter,
    size,
    search,
    page,
    type
  } = getFilterParams(request.query, { filterOpts: ['scheduled', 'open', 'subscription', 'finished'] })
  console.log('passei aq')
  try {
    const user_id = request.user.sub
    const role = request.user.role

    const entity = await SelectEntityOrDirector(user_id, role)

    if (!entity) {
      throw new ResourceNotFoundError()
    }
    // filter will be on 'AND' expression
    let filterParams: Prisma.AnnouncementWhereInput[] = []
    if (filter) {
      const today = new Date()
      switch (filter) {
        case 'scheduled':
          filterParams.push({ announcementBegin: { gt: today } })
          break
        case 'open':
          filterParams.push(...[{ announcementBegin: { lte: today } }, { announcementDate: { gt: today } }])
          break
        case 'subscription':
          filterParams.push(...[{ openDate: { lte: today } }, { closeDate: { gt: today } }])
          break
        case 'finished':
          filterParams.push(...[{ announcementDate: { lte: today } }])
          break
      }
      if (search && type === "announcement") {
        filterParams.push({ announcementName: { contains: search, mode: "insensitive" } })
      }
    }

    const currentDate = new Date()
    // const pageSize = 30; // number of records per page
    // const pageNumber = page_number || 1; // page number
    console.log(currentDate)
    const total = await prisma.announcement.count({
      where: {
        entity_id: entity.id,
        AND: filterParams
      },
    })
    const announcements = await prisma.announcement.findMany({
      where: {
        entity_id: entity.id,
        AND: filterParams
      },
      include: {
        entity: true,
        entity_subsidiary: true
      },
      skip: page * size,
      take: size
    });

    return reply.status(200).send({ announcements, entity, total })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
