import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getApplications(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const applicationParamsSchema = z.object({
    candidate_id: z.string().optional(),
  })
  const applicationBodySchema = z.object({
    candidate_id: z.string().optional(),
  })

  const { candidate_id } = applicationParamsSchema.parse(request.params)
  // const { candidate_id } = applicationBodySchema.parse(request.body)

  try {
    const userType = request.user.role
    const userId = request.user.sub
    const candidate = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })
    const user = await SelectCandidateResponsible(userId)
    const id = user?.UserData.id
    // console.log('user', userType)
    const applications = await prisma.application.findMany({
      where: { OR: [{ candidate_id: id }, { responsible_id: id }] },
      include: {
        candidate: true,
        announcement: {
          include: { entity: true }
        },
        // EducationLevel: true,
        // SocialAssistant: true
      }
    })
    return reply.status(200).send({ applications })
    // if (!user?.IsResponsible) {
    //   // if (application_id) {
    //   //   const solicitations = await prisma.requests.findMany({
    //   //     where: {
    //   //       application_id,
    //   //       answered: false,
    //   //     },
    //   //   })

    //   //   return reply.status(200).send({ solicitations })
    //   // } else {
    //     const applications = await prisma.application.findMany({
    //       where: { candidate_id: candidate.id },
    //       include: {
    //         announcement: true, // inclui detalhes do anúncio
    //         EducationLevel: true,
    //         SocialAssistant: true
    //       }
    //     })
    //     return reply.status(200).send({ applications })
    //   // }
    // } else {
    //   if (userType === 'RESPONSIBLE') {
    //     console.log(request.user)
    //     const responsible = await prisma.legalResponsible.findMany({
    //       where: { user_id: userId },
    //       include: {
    //         Candidate: true
    //       }
    //     })
    //     const applications = await prisma.application.findMany({
    //       where: { candidate_id: { in: responsible.map((candidate) => candidate.id) } },
    //       include: {
    //         announcement: true, // inclui detalhes do anúncio
    //         EducationLevel: true,
    //         SocialAssistant: true
    //       }
    //     })
    //     return reply.status(200).send({ applications })
    //   }
    //   const candidate = await prisma.candidate.findUnique({
    //     where: { id: candidate_id },
    //   })
    //   if (!candidate) {
    //     throw new NotAllowedError()
    //   }

    //   if (application_id) {
    //     const solicitations = await prisma.requests.findMany({
    //       where: {
    //         application_id,
    //         answered: false,
    //       },
    //     })

    //     return reply.status(200).send({ solicitations })
    //   } else {
    //     const applications = await prisma.application.findMany({
    //       where: { candidate_id: candidate.id },
    //       include: {
    //         announcement: true, // inclui detalhes do anúncio
    //         EducationLevel: true,
    //         SocialAssistant: true
    //       }
    //     })

    //     return reply.status(200).send({ applications })
    //   }
    // }
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof AnnouncementNotExists) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
