import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getApplicationHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const applicationParamsSchema = z.object({
    application_id: z.string().optional(),
  })
  
  console.log('====================================');
  console.log(request.body);
  console.log('====================================');
  const { application_id } = applicationParamsSchema.parse(request.params)
  console.log('chegamos aqui')

  try {
    const userType = request.user.role
    const userId = request.user.sub
    
    const candidate = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })
    
    if (candidate) {
      
      

      if (application_id) {
        const applicationHistory = await prisma.applicationHistory.findMany({
          where: {
            application_id,
          },
          
        })

        return reply.status(200).send({ applicationHistory })
      } else {
        const applications = await prisma.application.findMany({
          where: { candidate_id: candidate.id },
          include: {
            announcement: true, // inclui detalhes do anúncio
            EducationLevel: true,
            SocialAssistant: true
          }
        })

        return reply.status(200).send({ applications })
      }
    } 
    }
   catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof AnnouncementNotExists) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
