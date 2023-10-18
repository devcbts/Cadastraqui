import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


enum ApplicationStatus {
  "Approved",
  "Rejected",
  "Pending"
  // Add other statuses as needed
}


export async function subscribeAnnouncement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    announcement_id: z.string(),

  })
  const {
    announcement_id
  } = createBodySchema.parse(request.body)
  try {
    const userType = request.user.role
    const userId = request.user.sub

    if (userType !== 'CANDIDATE') {
      throw new NotAllowedError()
    }

    const candidate = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    if (!candidate) {
      throw new NotAllowedError()
    }

    const applicationExists = await prisma.application.findFirst({
      where: { candidate_id: candidate.id, announcement_id: announcement_id },
    })
    if (applicationExists) {
      throw new ApplicationAlreadyExistsError()
    }
    // Criar inscrição
    const application = await prisma.application.create({
      data: {
        candidate_id: candidate.id,
        announcement_id,
        status: "Pending",
      }
    })

    // Criar primeiro histórico
    const history = await prisma.applicationHistory.create({
      data: {
        application_id: application.id,
        description: "Inscrição Criada"
      }
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof ApplicationAlreadyExistsError) {
      return reply.status(404).send({ message: err.message })

    }

    return reply.status(500).send({ message: err.message })
  }
}
