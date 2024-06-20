import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAnnouncements(
  request: FastifyRequest,
  reply: FastifyReply,

) {
  const fetchParamsSchema = z.object({
    announcement_id: z.string().optional()
  })

  const { announcement_id } = fetchParamsSchema.parse(request.params)
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
    if (announcement_id) {
      let pdf = null;
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcement_id }, include: {
          Application: true,
          entity: true,
          educationLevels: { include: { entitySubsidiary: true } },
          socialAssistant: true
        }
      })
      if (announcement) {
        try {
          const Folder = `Announcemenets/${announcement.entity_id}/${announcement_id}.pdf`;
          pdf = await GetUrl(Folder);
        } catch (err) {

        }
      }
      // map to return the correct educationLevel entity
      const mappedAnnouncement = {
        ...announcement,
        pdf,
        educationLevels: announcement?.educationLevels.map((education) => {
          return (
            {
              ...education,
              entityName: education.entitySubsidiary?.socialReason ?? announcement.entity.socialReason,
              city: education.entitySubsidiary?.city ?? announcement.entity.city
            }
          )
        })
      }
      return reply.status(200).send({ announcement: mappedAnnouncement })

    }

    const announcements = await prisma.announcement.findMany({
      where: { entity_id: entity.id }, include: {
        entity: true,
        entity_subsidiary: true
      }

    })

    return reply.status(200).send({ announcements, entity })
  } catch (err: any) {
    console.log(err)
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
