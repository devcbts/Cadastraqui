import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerMonthlyIncomeInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const IncomeSource = z.enum([
    'PrivateEmployee',
    "PublicEmployee",
    "DomesticEmployee",
    "TemporaryRuralEmployee",
    "BusinessOwnerSimplifiedTax",
    "BusinessOwner",
    "IndividualEntrepreneur",
    "SelfEmployed",
    "Retired",
    "Pensioner",
    "Apprentice",
    "Volunteer",
    "RentalIncome",
    "Student",
    "InformalWorker",
    "Unemployed",
    "TemporaryDisabilityBenefit",
    "LiberalProfessional",
    "FinancialHelpFromOthers",
    "Alimony",
    "PrivatePension"
  ])

  const MontlhyIncomeDataSchemaTest = z.object({
    incomeSource: IncomeSource,


    date: z.date().or(z.string().transform(v => new Date(v))).default(new Date()),
    grossAmount: z.number().default(0),
    proLabore: z.number().default(0),
    dividends: z.number().default(0),
    deductionValue: z.number().default(0),
    publicPension: z.number().default(0),
    incomeTax: z.number().default(0),
    otherDeductions: z.number().default(0),
    foodAllowanceValue: z.number().default(0),
    transportAllowanceValue: z.number().default(0),
    expenseReimbursementValue: z.number().default(0),
    advancePaymentValue: z.number().default(0),
    reversalValue: z.number().default(0),
    compensationValue: z.number().default(0),
    judicialPensionValue: z.number().default(0),

  })

  const incomeParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = incomeParamsSchema.parse(request.params)


  const monthlyIncome = MontlhyIncomeDataSchemaTest.parse(request.body)


  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id }
    })
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate && !responsible) {
      throw new ResourceNotFoundError()
    }

    const isCandidateOrResponsible = await ChooseCandidateResponsible(_id)
    // Verifica se existe um familiar cadastrado com o owner_id

    const idField = isCandidateOrResponsible ? (isCandidateOrResponsible.IsResponsible ? { responsible_id: _id } : { candidate_id: _id }) : { familyMember_id: _id };

    // iterate over the month array to get all total income
      if (monthlyIncome.grossAmount) {
        let liquidAmount =
          monthlyIncome.grossAmount -
          monthlyIncome.foodAllowanceValue -
          monthlyIncome.transportAllowanceValue -
          monthlyIncome.compensationValue -
          monthlyIncome.expenseReimbursementValue -
          monthlyIncome.advancePaymentValue -
          monthlyIncome.reversalValue -
          monthlyIncome.judicialPensionValue
        if (monthlyIncome.proLabore && monthlyIncome.dividends) {
          liquidAmount = monthlyIncome.proLabore + monthlyIncome.dividends
        }
        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: monthlyIncome.grossAmount,
            liquidAmount,
            date: monthlyIncome.date,
            advancePaymentValue: monthlyIncome.advancePaymentValue,
            compensationValue: monthlyIncome.compensationValue,
            deductionValue: monthlyIncome.deductionValue,
            expenseReimbursementValue: monthlyIncome.expenseReimbursementValue,
            incomeTax: monthlyIncome.incomeTax,
            judicialPensionValue: monthlyIncome.judicialPensionValue,
            otherDeductions: monthlyIncome.otherDeductions,
            publicPension: monthlyIncome.publicPension,
            reversalValue: monthlyIncome.reversalValue,
            foodAllowanceValue: monthlyIncome.foodAllowanceValue,
            transportAllowanceValue: monthlyIncome.transportAllowanceValue,
            ...idField,
            dividends: monthlyIncome.dividends,
            proLabore: monthlyIncome.proLabore,
            incomeSource: monthlyIncome.incomeSource
          }
        })
      } else {
        const total = (monthlyIncome.dividends || 0) + (monthlyIncome.proLabore || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: monthlyIncome.grossAmount,
            date: monthlyIncome.date,
            advancePaymentValue: monthlyIncome.advancePaymentValue,
            compensationValue: monthlyIncome.compensationValue,
            deductionValue: monthlyIncome.deductionValue,
            expenseReimbursementValue: monthlyIncome.expenseReimbursementValue,
            incomeTax: monthlyIncome.incomeTax,
            judicialPensionValue: monthlyIncome.judicialPensionValue,
            otherDeductions: monthlyIncome.otherDeductions,
            publicPension: monthlyIncome.publicPension,
            proLabore: monthlyIncome.proLabore,
            dividends: monthlyIncome.dividends,
            reversalValue: monthlyIncome.reversalValue,
            foodAllowanceValue: monthlyIncome.foodAllowanceValue,
            transportAllowanceValue: monthlyIncome.transportAllowanceValue,
            total,
            ...idField,
            incomeSource: monthlyIncome.incomeSource
          },
        })
      }
    



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
