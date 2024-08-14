import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { AnnouncementClosed } from '@/errors/announcement-closed-error'
import { CandidateNotFoundError } from '@/errors/candidate-not-found-error'
import { EducationLevelNotFoundError } from '@/errors/education-level-not-found-error'
import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import findAllDiseases from '@/HistDatabaseFunctions/Handle Application/find-all-diseases'
import { prisma } from '@/lib/prisma'
import dateToTimezone from '@/utils/date-to-timezone'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { CalculateIncomePerCapita } from '@/utils/Trigger-Functions/calculate-income-per-capita'
import calculateDistance from '@/utils/Trigger-Functions/search-distance'
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

    const candidate = await prisma.candidate.findUnique({
      where: { id: (candidate_id || CandidateOrResponsible.UserData.id) },
    })
    // check if the candidate is the legal dependent of the responsible
    if (!candidate) {
      throw new ResourceNotFoundError()

    }

    const announcement = await prisma.announcement.findUnique({
      where: { id: announcement_id },
      select: {
        closeDate: true,
        entity_id: true,
        openDate: true,
      }
    })
    if (!announcement) {
      throw new ResourceNotFoundError()

    }
    const today = dateToTimezone(new Date())
    console.log(announcement.closeDate!, today)
    if (announcement.closeDate! < today || announcement.openDate! > today) {
      throw new AnnouncementClosed()

    }


    const applicationExists = await prisma.application.findFirst({
      where: { AND: [{ candidate_id: candidate.id }, { announcement_id }, { educationLevel_id: educationLevel_id }] },
    })
    if (applicationExists) {
      throw new ApplicationAlreadyExistsError()
    }

    const idFielProgress = CandidateOrResponsible.IsResponsible ? { legalResponsibleId: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id }
    const progress = await prisma.finishedRegistration.findUnique({
      where: idFielProgress
    })
    if (!progress) {
      throw new Error("Cadastro ainda não finalizado")

    }
    const booleanFields = [
      'cadastrante',
      'grupoFamiliar',
      'moradia',
      'veiculos',
      'rendaMensal',
      'despesas',
      'saude',
      'declaracoes',
    ];

    booleanFields.forEach(field => {
      if (!(progress as any)[field]) {
        throw new Error(`Cadastro ainda não finalizado`);
      }
    });
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
    const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapita(CandidateOrResponsible.UserData.id)
    const severeDisease = await findAllDiseases(CandidateOrResponsible.UserData.id, CandidateOrResponsible.UserData.id)
    const candidateInfo = await prisma.identityDetails.findUnique({
      where: idFieldForSearch,
      select: {
        city: true,
        UF: true,
        CEP: true,
        neighborhood: true,
        address: true,
        addressNumber: true,
        complement: true,
      }
    })
    if (!candidateInfo) {
      throw new CandidateNotFoundError()

    }


    const educationLevel = await prisma.educationLevel.findUnique({
      where: { id: educationLevel_id }
    })
    if (!educationLevel) {
      throw new EducationLevelNotFoundError()
    }
    const entityInfo = educationLevel.entitySubsidiaryId ? await prisma.entitySubsidiary.findUnique({
      where: { id: educationLevel.entitySubsidiaryId }
    }) : await prisma.entity.findUnique({
      where: { id: announcement.entity_id }
    })

    if (!entityInfo) {
      throw new EntityNotExistsError()

    }
    const candidateLocation = `${candidateInfo.address}, ${candidateInfo.addressNumber}, ${candidateInfo.neighborhood}, ${candidateInfo.city}, ${candidateInfo.UF}, ${candidateInfo.CEP}`

    const entityLocation = entityInfo.address ? `${entityInfo.address}, ${entityInfo.addressNumber}, ${entityInfo.neighborhood}, ${entityInfo.city}, ${entityInfo.UF}, ${entityInfo.CEP}` : ''
    const distance = await calculateDistance(candidateLocation, entityLocation)
    console.log(distance)
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
        distance,
        ...idField
      },
    })

    // Criar primeiro histórico
    await prisma.applicationHistory.create({
      data: {
        application_id: application.id,
        description: 'Inscrição Criada',
        createdBy: 'Candidate'
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    console.log(err)
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof CandidateNotFoundError) {
      return reply.status(404).send({ message: err.message })

    }
    if (err instanceof EducationLevelNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof EntityNotExistsError) {
      return reply.status(404).send({ message: err.message })

    }
    if (err instanceof ApplicationAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })

    }
    if (err instanceof AnnouncementClosed) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof Error) {
      return reply.status(412).send({ message: err.message })

    }
    return reply.status(500).send({ message: err.message })
  }
}
