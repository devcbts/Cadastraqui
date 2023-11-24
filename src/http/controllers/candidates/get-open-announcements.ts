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
    } else {
      announcements = await prisma.announcement.findUnique({
        where: { id: announcement_id, announcementDate: { gte: new Date() } },
        include:{
          educationLevels: true,
          entity: true,
          entity_subsidiary: true,
        }
      })
    }
    return reply.status(200).send({ announcements })
  } catch (err: any) {
    return reply.status(500).send({ message: err.message })
  }
}
