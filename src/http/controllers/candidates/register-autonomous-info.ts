import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const EmploymentType = z.enum([
  'PrivateEmployee',
  'PublicEmployee',
  'DomesticEmployee',
  'TemporaryRuralEmployee',
  'BusinessOwnerSimplifiedTax',
  'BusinessOwner',
  'IndividualEntrepreneur',
  'SelfEmployed',
  'Retired',
  'Pensioner',
  'Apprentice',
  'Volunteer',
  'RentalIncome',
  'Student',
  'InformalWorker',
  'Unemployed',
  'TemporaryDisabilityBenefit',
  'LiberalProfessional',
  'FinancialHelpFromOthers',
  'Alimony',
  'PrivatePension',
])

export async function registerAutonomousInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AutonomousDataSchema = z.object({
    financialAssistantCPF: z.string().optional(),
    employmentType: EmploymentType,
  })

  const AutonomousParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = AutonomousParamsSchema.parse(request.params)

  const { financialAssistantCPF, employmentType } = AutonomousDataSchema.parse(
    request.body,
  )

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    // Verifica se existe um candidato associado ao user_id
    const responsible = await prisma.legalResponsible.findUnique({
      where: {user_id}
    })
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate && !responsible) {
      throw new ResourceNotFoundError()
    }

      // Verifica se o cadastro é para o candidato
      const isCandidate = await prisma.candidate.findUnique({
        where: {id: _id}
      })
      
      const idField = isCandidate ? { candidate_id: _id } : { familyMember_id: _id };
  

    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: idField,
    })

    const totalAmount = monthlyIncomes.reduce((acc, current) => {
      return acc + (current.grossAmount || 0)
    }, 0)

    let avgIncome = 0;
    if (monthlyIncomes.length > 0) {
      avgIncome = totalAmount / monthlyIncomes.length;
    }

    // Armazena informações acerca do Empresário no banco de dados
    await prisma.familyMemberIncome.create({
      data: {
        employmentType,
        averageIncome: avgIncome.toString(),
        financialAssistantCPF,
        ...idField
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
