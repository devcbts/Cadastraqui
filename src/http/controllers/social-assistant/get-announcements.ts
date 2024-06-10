import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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
    })
    if (!assistant) {
      throw new ResourceNotFoundError()
    }
    // Verifica se existe o processo seletivo
    let announcement
    if (!announcement_id) {
      announcement = await prisma.announcement.findMany({
        where: {
          socialAssistant: {
            some: {
              id: assistant.id,

            },
          },
        },
        include: {
          entity: true,
          educationLevels: true,
        },

      })
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

      return reply.status(200).send({ announcements: response })

    } else {
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcement_id },
        include: {
          educationLevels: true,
          entity: true,
          entity_subsidiary: true,
        }
      })

      if (!announcement) {
        throw new ResourceNotFoundError()
      }
      const educationLevels = announcement.educationLevels
      const entityAndSubsidiaries = [announcement.entity, ...announcement.entity_subsidiary]
      const educationLevelsFiltered = entityAndSubsidiaries.map((entity) => {
        const matchedEducationLevels = educationLevels.filter((educationLevel) => educationLevel.entitySubsidiaryId === entity.id)
        if (entity.id == announcement.entity_id) {
          const matchedEducationLevels = educationLevels.filter((educationLevel) => educationLevel.entitySubsidiaryId === null)
          const returnObj = matchedEducationLevels.map((e) => ({
            id: e.id,
            education: e.basicEduType,
            shift: e.shift,
            entity: entity.socialReason,
            grade: e.grade,
          }))
          return { ...entity, matchedEducationLevels: returnObj }
        }
        const returnObj = matchedEducationLevels.map((e) => ({
          id: e.id,
          education: e.basicEduType,
          shift: e.shift,
          entity: entity.socialReason,
          grade: e.grade,
        }))
        return { ...entity, matchedEducationLevels: returnObj }
      })
      return reply.status(200).send({ announcement: announcement, educationLevels: educationLevelsFiltered })
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

    return reply.status(500).send({ message: err.message })
  }
}
