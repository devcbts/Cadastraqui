import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getOpenAnnouncements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const announcementParamsSchema = z.object({
    announcement_id: z.string().optional(),
  })

  const { announcement_id } = announcementParamsSchema.parse(request.params)
  try {
    // Pega os editais que ainda estão abertos
    let announcements
    if (!announcement_id) {
      announcements = await prisma.announcement.findMany({
        where: { announcementDate: { gte: new Date() } },
        include: {
          entity: true,
          entity_subsidiary: true
        }
      })
      console.log(announcements)
    } else {
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcement_id, announcementDate: { gte: new Date() } },
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

          return {...entity, matchedEducationLevels}
        }
        return {...entity, matchedEducationLevels}
      })
      return reply.status(200).send({ educationLevels: educationLevelsFiltered })

    }
    return reply.status(200).send({ announcements })
  } catch (err: any) {
    return reply.status(500).send({ message: err.message })
  }
}
