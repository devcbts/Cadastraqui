import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerEntepreneursInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
  const EntepreneurDataSchema = z.object({
    quantity: z.number(),
    startDate: z.string(),
    fantasyName: z.string(),
    CNPJ: z.string(),
    socialReason: z.string(),
    employmentType: EmploymentType,
  })

  const EntepreneurParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = EntepreneurParamsSchema.parse(request.params)

  const { CNPJ, fantasyName, socialReason, employmentType, startDate, quantity } = EntepreneurDataSchema.parse(
    request.body,
  )

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o owner_id
    // Verifica se o cadastro é para o candidato
    const isCandidate = await prisma.candidate.findUnique({
      where: { id: _id }
    })

    const idField = isCandidate ? { candidate_id: _id } : { familyMember_id: _id };

    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: idField,
    })

    const validIncomes = monthlyIncomes.filter(income => income.liquidAmount !== null && income.liquidAmount > 0);
    // Calcula o totalAmount usando o array filtrado
    const totalAmount = validIncomes.reduce((acc, current) => {
      return acc + (current.liquidAmount || 0);
    }, 0);

    // Calcula a média apenas com os incomes válidos
    const avgIncome = validIncomes.length > 0 ? totalAmount / validIncomes.length : 0;

    // Deleta todas as antigas instancias daquele tipo de renda
    await prisma.familyMemberIncome.deleteMany({
      where: { ...idField, employmentType: employmentType }
    })
    // Armazena informações acerca do Empresário no banco de dados
    await prisma.familyMemberIncome.create({
      data: {
        employmentType: employmentType,
        CNPJ,
        averageIncome: avgIncome.toString(),
        socialReason,
        fantasyName,
        startDate: new Date(startDate),
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
