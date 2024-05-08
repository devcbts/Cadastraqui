import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function subscribeAnnouncement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  

  const createParamsSchema = z.object({
    announcement_id: z.string(),
    educationLevel_id: z.string(),
    candidate_id: z.string().optional()
  })
  const { announcement_id, educationLevel_id, candidate_id } = createParamsSchema.parse(
    request.params,
  )
  try {
    const userId = request.user.sub

    const CandidateOrResponsible = await SelectCandidateResponsible(userId)
    if (!CandidateOrResponsible) {
      throw new NotAllowedError()
    }

    let candidate = CandidateOrResponsible.UserData

    // check if the candidate is the legal dependent of the responsible
    if (CandidateOrResponsible.IsResponsible) { 
      const legalDependent = await prisma.candidate.findUnique({
        where: { id: candidate_id, responsible_id: CandidateOrResponsible.UserData.id },
      })
      if (!legalDependent) {
        throw new NotAllowedError()
      }
      candidate = legalDependent
    }
    
    if (!CandidateOrResponsible.UserData.finishedapplication) {
      throw new Error('Dados cadastrais não preenchidos completamente! Volte para a sessão de cadastro.')
    }

    const applicationExists = await prisma.application.findFirst({
      where: { candidate_id: candidate.id, announcement_id },
    })
    if (applicationExists) {
      throw new ApplicationAlreadyExistsError()
    }



    const numberOfApplications = await prisma.application.count({
      where: { announcement_id },
    });

    // O número da inscrição será o total de inscrições existentes + 1
    const applicationNumber = numberOfApplications + 1;
    // Criar inscrição
    const application = await prisma.application.create({
      data: {
        candidate_id: candidate.id,
        announcement_id,
        status: 'Pending',
        educationLevel_id,
        candidateName: candidate.name,
        number: applicationNumber
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
      return reply.status(404).send({ err })
    }
    if (err instanceof ApplicationAlreadyExistsError) {
      return reply.status(409).send({ err })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
      
    }
    if (err instanceof Error) {
      return reply.status(405).send({ err })
    }
    return reply.status(500).send({ message: err.message })
  }
}
