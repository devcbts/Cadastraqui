import { ForbiddenError } from '@/errors/forbidden-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
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
    const user_id = request.user.sub
    const isUser = await SelectCandidateResponsible(user_id)
    if (!isUser) {
      throw new ForbiddenError()
    }
    let announcements
    if (!announcement_id) {
      const announcementsSeen = await prisma.announcementsSeen.findMany({
        where: { OR: [{ candidate_id: isUser.UserData.id }, { responsible_id: isUser.UserData.id }] },
        select: {
          announcement: {
            include: {
              entity: true,
              entity_subsidiary: true,
            },
          },
        }
      })
      console.log('vistos', announcementsSeen)
      const announcementsFiltered = announcementsSeen.filter((announcementSee) => {
        if (announcementSee.announcement.announcementBegin! <= new Date() && announcementSee.announcement.announcementDate! >= new Date()) {
          return announcementSee.announcement
        }
      })
      return reply.status(200).send({ announcements: announcementsFiltered })
    }
    else {
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcement_id, announcementDate: { gte: new Date() } },
        include: {
          educationLevels: true,
          entity: {
            include: {
              user: { select: { email: true } },
              EntitySubsidiary: {
                include: { user: { select: { email: true } } }
              },
            }
          },
        }
      })
      console.log(announcement)
      if (!announcement) {
        throw new ResourceNotFoundError()
      }
      const Route = `ProfilePictures/${announcement.entity.id}`
      const logo = await GetUrl(Route)
      const educationLevels = announcement.educationLevels
      const entityAndSubsidiaries = [announcement.entity, ...announcement.entity.EntitySubsidiary]
      const educationLevelsFiltered = entityAndSubsidiaries.map((entity) => {
        const matchedEducationLevels = educationLevels.filter((educationLevel) => educationLevel.entitySubsidiaryId === entity.id)
        if (entity.id === announcement.entity.id) {
          matchedEducationLevels.push(...educationLevels.filter((educationLevel) => educationLevel.entitySubsidiaryId === null))

        }
        return { ...entity, matchedEducationLevels }
      })
      return reply.status(200).send({ announcement: { ...announcement, logo }, educationLevels: educationLevelsFiltered })

    }

  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })

    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Edital não encontrado" })

    }
    return reply.status(500).send({ message: err })
  }
}
