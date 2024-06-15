import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import findAllDiseases from '@/HistDatabaseFunctions/Handle Application/find-all-diseases'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { CalculateIncomePerCapita } from '@/utils/Trigger-Functions/calculate-income-per-capita'
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
    console.log('3')
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
      console.log('erro aqui')
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
    const idField = CandidateOrResponsible.IsResponsible ? { responsible_id: CandidateOrResponsible.UserData.id } : ''
    const idFieldForSearch = CandidateOrResponsible.IsResponsible ? { responsible_id: CandidateOrResponsible.UserData.id } : { candidate_id: candidate.id }


      const hasCadUnico = await prisma.identityDetails.findUnique({
        where: idFieldForSearch,
        select: { CadUnico: true }
      })
      const {incomePerCapita, incomesPerMember} = await CalculateIncomePerCapita(CandidateOrResponsible.UserData.id)
      const severeDisease = await findAllDiseases(CandidateOrResponsible.UserData.id, CandidateOrResponsible.UserData.id)
    const application = await prisma.application.create({
      data: {
        candidate_id: candidate.id,
        announcement_id,
        status: 'NotAnalysed',
        educationLevel_id,
        candidateName: candidate.name,
        number: applicationNumber,
        averageIncome: incomePerCapita,
        CadUnico: hasCadUnico?.CadUnico,
        hasSevereDesease: severeDisease ? severeDisease.length > 0 : false,
        ...idField
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
    console.log(err)
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
      return reply.status(400).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
