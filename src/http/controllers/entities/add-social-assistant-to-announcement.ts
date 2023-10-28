import { announcementAlreadyExists } from '@/errors/announcement-already-exists-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function addAssistantAnnouncement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AddAssistantBodySchema = z.object({
    announcement_id: z.string(),
    assistant_id: z.string(),
  })

  const { announcement_id, assistant_id } = AddAssistantBodySchema.parse(
    request.body,
  )

  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcement_id },
    })
    const assistant = await prisma.socialAssistant.findUnique({
      where: { id: assistant_id },
    })

    if (!assistant || !announcement) {
      throw new ResourceNotFoundError()
    }
    await prisma.socialAssistant.update({
      where: { id: assistant_id },
      data: {
        Announcement: {
          connect: {
            id: announcement_id,
          },
        },
      },
    })
  } catch (err: any) {
    if (err instanceof announcementAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
  return reply.status(204).send()
}
