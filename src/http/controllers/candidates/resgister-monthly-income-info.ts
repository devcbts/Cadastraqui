import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerMonthlyIncomeInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const MontlhyIncomeDataSchema = z.object({
    month: z.string(),
    year: z.string(),
    grossAmount: z.number().optional(),
    proLabore: z.number().optional(),
    dividends: z.number().optional(),
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

  const {
    advancePaymentValue,
    compensationValue,
    deductionValue,
    expenseReimbursementValue,
    foodAllowanceValue,
    grossAmount,
    incomeTax,
    judicialPensionValue,
    month,
    otherDeductions,
    publicPension,
    reversalValue,
    transportAllowanceValue,
    year,
    dividends,
    proLabore,
  } = MontlhyIncomeDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o owner_id
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })
    if (!familyMember) {
      throw new NotAllowedError()
    }

    if (grossAmount) {
      const liquidAmount =
        grossAmount -
        foodAllowanceValue -
        transportAllowanceValue -
        expenseReimbursementValue -
        advancePaymentValue -
        reversalValue -
        judicialPensionValue

      // Armazena informações acerca da renda mensal no banco de dados
      await prisma.monthlyIncome.create({
        data: {
          grossAmount,
          liquidAmount,
          month,
          year,
          advancePaymentValue,
          compensationValue,
          deductionValue,
          expenseReimbursementValue,
          familyMember_id: _id,
          incomeTax,
          judicialPensionValue,
          otherDeductions,
          publicPension,
          reversalValue,
          foodAllowanceValue,
          transportAllowanceValue,
        },
      })
    } else {
      const total = (dividends || 0) + (proLabore || 0)
      // Armazena informações acerca da renda mensal no banco de dados (Empresário)
      await prisma.monthlyIncome.create({
        data: {
          month,
          year,
          advancePaymentValue,
          compensationValue,
          deductionValue,
          expenseReimbursementValue,
          familyMember_id: _id,
          incomeTax,
          judicialPensionValue,
          otherDeductions,
          publicPension,
          reversalValue,
          foodAllowanceValue,
          transportAllowanceValue,
          dividends,
          proLabore,
          total,
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
