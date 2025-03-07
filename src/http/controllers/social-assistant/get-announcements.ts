import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { APIError } from '@/errors/api-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { prisma } from '@/lib/prisma'
import getFilterParams from '@/utils/get-filter-params'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getAnnouncements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const announcementParamsSchema = z.object({
    announcement_id: z.string().optional(),
  })

  const { announcement_id } = announcementParamsSchema.parse(request.params)
  try {
    const userId = request.user.sub

    const assistant = await prisma.socialAssistant.findUnique({
      where: { user_id: userId },
      select: { id: true }
    })
    if (!assistant) {
      throw new ResourceNotFoundError()
    }
    // Verifica se existe o processo seletivo
    let announcement
    if (!announcement_id) {
      const {
        filter,
        page,
        search, size, type
      } = getFilterParams(request.query,)
      const getFilter = () => {
        let baseFilter: any[] = [
          ((type && search)
            ? (type === "entity" ? { entity: { socialReason: { equals: search, mode: "insensitive" } } } : { announcementName: { contains: search, mode: "insensitive" } })
            : {})
        ]

        if (!filter) {
          baseFilter.push({})
        }
        const currentDate = new Date()
        if (filter === 'scheduled') {
          baseFilter.push({ announcementBegin: { gt: currentDate } })
        }
        if (filter === 'subscription') {
          baseFilter.push(...[
            { openDate: { lt: currentDate } },
            { closeDate: { gte: currentDate } },
          ])
        }
        if (filter === 'validation') {
          baseFilter.push(...[
            { closeDate: { lt: currentDate } },
            { announcementDate: { gte: currentDate } },
            {
              OR: [
                { interview: { is: null } },
                { interview: { AND: [{ startDate: { lte: currentDate } }, { endDate: { gt: currentDate } }] } }
              ]
            }
          ])
        }
        if (filter === 'finished') {
          baseFilter.push(...[
            { closeDate: { lt: currentDate } },
            { announcementDate: { lt: currentDate } },
          ])
        }
        if (filter === 'validationFinished') {
          baseFilter.push({ interview: { endDate: { lt: currentDate } } })
        }
        return baseFilter
      }
      const [
        total,
        announcement
      ] = await prisma.$transaction([
        prisma.announcement.count({
          where: {
            AND: [{
              socialAssistant: {
                some: {
                  id: assistant.id,

                },
              },
            },
            { AND: getFilter() },
            ]

          },
        }),
        prisma.announcement.findMany({
          skip: page * size,
          take: size,
          where: {
            AND: [{
              socialAssistant: {
                some: {
                  id: assistant.id,

                },
              },
            },
            { AND: getFilter() },
            ]
          },
          include: {
            entity: true,
            educationLevels: { include: { course: true } },
          },

        })
      ])


      if (!announcement) {
        throw new AnnouncementNotExists()
      }
      const response = announcement.map((announc) => {

        return {
          id: announc.id,
          name: announc.announcementName,
          entity: announc.entity.socialReason,
          finished: (announc.announcementDate !== null && announc.announcementDate < new Date()) ? true : false,
          vacancies: announc.verifiedScholarships
        }
      })

      return reply.status(200).send({ announcements: response, total })

    } else {
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcement_id },
        include: {
          educationLevels: {
            include: {
              course: true
            }
          },
          entity: {
            include: {
              EntitySubsidiary: true
            }
          },
          entity_subsidiary: true,
          interview: true
        }
      })

      if (!announcement) {
        throw new ResourceNotFoundError()
      }
      const Folder = `Announcements/${announcement.entity_id}/${announcement_id}.pdf`;
      const url = await GetUrl(Folder);
      const educationLevels = announcement.educationLevels
      const entityAndSubsidiaries = [announcement.entity, ...announcement.entity.EntitySubsidiary]
      const educationLevelsFiltered = entityAndSubsidiaries.map((entity) => {
        const matchedEducationLevels = educationLevels.filter((educationLevel) => educationLevel.entitySubsidiaryId === entity.id)
        if (entity.id === announcement.entity_id) {
          const matchedEducationLevels = educationLevels.filter((educationLevel) => educationLevel.entitySubsidiaryId === null)
          const returnObj = matchedEducationLevels.map((e) => ({
            id: e.id,
            // education: e.basicEduType || e.higherEduScholarshipType,
            education: e.level,
            shift: e.shift,
            entity: entity.socialReason,
            grade: e.course?.name,
          }))
          return { ...entity, matchedEducationLevels: returnObj }
        }
        const returnObj = matchedEducationLevels.map((e) => ({
          id: e.id,
          // education: e.basicEduType || e.higherEduScholarshipType,
          education: e.level,
          shift: e.shift,
          entity: entity.socialReason,
          grade: e.course?.name,

        }))
        return { ...entity, matchedEducationLevels: returnObj }
      })
      return reply.status(200).send({ announcement: announcement, educationLevels: educationLevelsFiltered, url })
    }

  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof AnnouncementNotExists) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof APIError) {
      return reply.status(400).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
