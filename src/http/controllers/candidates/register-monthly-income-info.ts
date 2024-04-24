import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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
    quantity: z.number(),
    incomeSource: IncomeSource,

    incomes: z.array(z.object({
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
    }))
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

    const isCandidate = await prisma.candidate.findUnique({
      where: { id: _id }
    })
    // Verifica se existe um familiar cadastrado com o owner_id

    const idField = isCandidate ? { candidate_id: _id } : { familyMember_id: _id };
    await prisma.monthlyIncome.deleteMany({
      where: { ...idField, incomeSource: monthlyIncome.incomeSource }
    })
    // iterate over the month array to get all total income
    monthlyIncome.incomes.forEach(async (income) => {
      if (income.grossAmount) {
        let liquidAmount =
          income.grossAmount -
          income.foodAllowanceValue -
          income.transportAllowanceValue -
          income.compensationValue -
          income.expenseReimbursementValue -
          income.advancePaymentValue -
          income.reversalValue -
          income.judicialPensionValue
        if (income.proLabore && income.dividends) {
          liquidAmount = income.proLabore + income.dividends
        }
        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: income.grossAmount,
            liquidAmount,
            date: income.date,
            advancePaymentValue: income.advancePaymentValue,
            compensationValue: income.compensationValue,
            deductionValue: income.deductionValue,
            expenseReimbursementValue: income.expenseReimbursementValue,
            incomeTax: income.incomeTax,
            judicialPensionValue: income.judicialPensionValue,
            otherDeductions: income.otherDeductions,
            publicPension: income.publicPension,
            reversalValue: income.reversalValue,
            foodAllowanceValue: income.foodAllowanceValue,
            transportAllowanceValue: income.transportAllowanceValue,
            ...idField,
            dividends: income.dividends,
            proLabore: income.proLabore,
            incomeSource: monthlyIncome.incomeSource
          }
        })
      } else {
        const total = (income.dividends || 0) + (income.proLabore || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: income.grossAmount,
            date: income.date,
            advancePaymentValue: income.advancePaymentValue,
            compensationValue: income.compensationValue,
            deductionValue: income.deductionValue,
            expenseReimbursementValue: income.expenseReimbursementValue,
            incomeTax: income.incomeTax,
            judicialPensionValue: income.judicialPensionValue,
            otherDeductions: income.otherDeductions,
            publicPension: income.publicPension,
            proLabore: income.proLabore,
            dividends: income.dividends,
            reversalValue: income.reversalValue,
            foodAllowanceValue: income.foodAllowanceValue,
            transportAllowanceValue: income.transportAllowanceValue,
            total,
            ...idField,
            incomeSource: monthlyIncome.incomeSource
          },
        })
      }
    })


    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: { ...idField, incomeSource: monthlyIncome.incomeSource },
    })

    const validIncomes = monthlyIncomes.filter(income => income.liquidAmount !== null && income.liquidAmount > 0);
    // Calcula o totalAmount usando o array filtrado
    const totalAmount = validIncomes.reduce((acc, current) => {
      return acc + (current.liquidAmount || 0);
    }, 0);
    const avgIncome = validIncomes.length > 0 ? totalAmount / validIncomes.length : 0;

    // Atualiza o array de IncomeSource do candidato
    if (candidate) {
      await prisma.identityDetails.update({
        where: {
          candidate_id: candidate.id,
          NOT: {
            incomeSource: {
              has: monthlyIncome.incomeSource
            }
          }
        },
        data: {
          incomeSource: {
            set: [monthlyIncome.incomeSource],

          }
        }
      })
    }
    if (responsible) {
      await prisma.identityDetails.update({
        where: {
          responsible_id: responsible.id,
          NOT: {
            incomeSource: {
              has: monthlyIncome.incomeSource
            }
          }
        },
        data: {
          incomeSource: {
            set: [monthlyIncome.incomeSource],

          }
        }
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
