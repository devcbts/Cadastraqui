import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function subscribeAnnouncement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const ApplicationStatus = z.enum([
    'Approved',
    'Rejected',
    'Pending',
    // Add other statuses as needed
  ])

  const createParamsSchema = z.object({
    announcement_id: z.string(),
    educationLevel_id: z.string(),
  })
  const { announcement_id, educationLevel_id } = createParamsSchema.parse(
    request.params,
  )
  try {
    const userId = request.user.sub

    const candidate = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    const applicationExists = await prisma.application.findFirst({
      where: { candidate_id: candidate.id, announcement_id },
    })
    if (applicationExists) {
      throw new ApplicationAlreadyExistsError()
    }

    // Criar inscrição
    const application = await prisma.application.create({
      data: {
        candidate_id: candidate.id,
        announcement_id,
        status: 'Pending',
        educationLevel_id,
      },
    })

    // Criar primeiro histórico
    await prisma.applicationHistory.create({
      data: {
        application_id: application.id,
        description: 'Inscrição Criada',
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof ApplicationAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
