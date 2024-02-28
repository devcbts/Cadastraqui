import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getApplications(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const applicationParamsSchema = z.object({
    application_id: z.string().optional(),
    announcement_id: z.string(),
  })

  const { application_id, announcement_id } = applicationParamsSchema.parse(
    request.params,
  )
  try {
    const userType = request.user.role
    const userId = request.user.sub

    const assistant = await prisma.socialAssistant.findUnique({
      where: { user_id: userId },
    })

    if (!assistant) {
      throw new NotAllowedError()
    }

    // verifica se existe o processo seletivo
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcement_id },
      include: { entity: true}
    })

    if (announcement) {
      // verifica se o processo seletivo é da mesma entidade do assistente
      if (announcement.entity_id !== assistant.entity_id) {
        throw new NotAllowedError()
      }
      const entity = announcement.entity
      // Encontra uma ou mais inscrições
      if (!application_id) {
        const applications = await prisma.application.findMany({
          where: { announcement_id },
        })

        return reply.status(200).send({ applications, entity })
      } else {
        const application = await prisma.application.findUnique({
          where: { id: application_id },
          include: { EducationLevel : {
              include: {entitySubsidiary: true}
          }
        ,
        candidate:{
          include: {
            IdentityDetails: true,
            
          }
        }
        }
        })
        return reply.status(200).send({ application, entity })
      }
    } else {
      throw new AnnouncementNotExists()
    }
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof AnnouncementNotExists) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
