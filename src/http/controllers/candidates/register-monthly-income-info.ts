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
    month1: z.string(),
    year1: z.string(),
    grossAmount1: z.number().default(0),
    proLabore1: z.number().default(0),
    dividends1: z.number().default(0),
    deductionValue1: z.number().default(0),
    publicPension1: z.number().default(0),
    incomeTax1: z.number().default(0),
    otherDeductions1: z.number().default(0),
    foodAllowanceValue1: z.number().default(0),
    transportAllowanceValue1: z.number().default(0),
    expenseReimbursementValue1: z.number().default(0),
    advancePaymentValue1: z.number().default(0),
    reversalValue1: z.number().default(0),
    compensationValue1: z.number().default(0),
    judicialPensionValue1: z.number().default(0),
    month2: z.string(),
    year2: z.string(),
    grossAmount2: z.number().default(0),
    proLabore2: z.number().default(0),
    dividends2: z.number().default(0),
    deductionValue2: z.number().default(0),
    publicPension2: z.number().default(0),
    incomeTax2: z.number().default(0),
    otherDeductions2: z.number().default(0),
    foodAllowanceValue2: z.number().default(0),
    transportAllowanceValue2: z.number().default(0),
    expenseReimbursementValue2: z.number().default(0),
    advancePaymentValue2: z.number().default(0),
    reversalValue2: z.number().default(0),
    compensationValue2: z.number().default(0),
    judicialPensionValue2: z.number().default(0),
    month3: z.string(),
    year3: z.string(),
    grossAmount3: z.number().default(0),
    proLabore3: z.number().default(0),
    dividends3: z.number().default(0),
    deductionValue3: z.number().default(0),
    publicPension3: z.number().default(0),
    incomeTax3: z.number().default(0),
    otherDeductions3: z.number().default(0),
    foodAllowanceValue3: z.number().default(0),
    transportAllowanceValue3: z.number().default(0),
    expenseReimbursementValue3: z.number().default(0),
    advancePaymentValue3: z.number().default(0),
    reversalValue3: z.number().default(0),
    compensationValue3: z.number().default(0),
    judicialPensionValue3: z.number().default(0),
    month4: z.string().optional(),
    year4: z.string().optional(),
    grossAmount4: z.number().optional(),
    proLabore4: z.number().default(0),
    dividends4: z.number().default(0),
    deductionValue4: z.number().default(0),
    publicPension4: z.number().default(0),
    incomeTax4: z.number().default(0),
    otherDeductions4: z.number().default(0),
    foodAllowanceValue4: z.number().default(0),
    transportAllowanceValue4: z.number().default(0),
    expenseReimbursementValue4: z.number().default(0),
    advancePaymentValue4: z.number().default(0),
    reversalValue4: z.number().default(0),
    compensationValue4: z.number().default(0),
    judicialPensionValue4: z.number().default(0),
    month5: z.string().optional().optional(),
    year5: z.string().optional().optional(),
    grossAmount5: z.number().optional(),
    proLabore5: z.number().default(0),
    dividends5: z.number().default(0),
    deductionValue5: z.number().default(0),
    publicPension5: z.number().default(0),
    incomeTax5: z.number().default(0),
    otherDeductions5: z.number().default(0),
    foodAllowanceValue5: z.number().default(0),
    transportAllowanceValue5: z.number().default(0),
    expenseReimbursementValue5: z.number().default(0),
    advancePaymentValue5: z.number().default(0),
    reversalValue5: z.number().default(0),
    compensationValue5: z.number().default(0),
    judicialPensionValue5: z.number().default(0),
    month6: z.string().optional(),
    year6: z.string().optional(),
    grossAmount6: z.number().optional(),
    proLabore6: z.number().default(0),
    dividends6: z.number().default(0),
    deductionValue6: z.number().default(0),
    publicPension6: z.number().default(0),
    incomeTax6: z.number().default(0),
    otherDeductions6: z.number().default(0),
    foodAllowanceValue6: z.number().default(0),
    transportAllowanceValue6: z.number().default(0),
    expenseReimbursementValue6: z.number().default(0),
    advancePaymentValue6: z.number().default(0),
    reversalValue6: z.number().default(0),
    compensationValue6: z.number().default(0),
    judicialPensionValue6: z.number().default(0),
    quantity: z.number(),
  })

  const incomeParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = incomeParamsSchema.parse(request.params)

  const {
    quantity,
    month1,
    month2,
    month3,
    year1,
    year2,
    year3,
    advancePaymentValue1,
    advancePaymentValue2,
    advancePaymentValue3,
    advancePaymentValue4,
    advancePaymentValue5,
    advancePaymentValue6,
    compensationValue1,
    compensationValue2,
    compensationValue3,
    compensationValue4,
    compensationValue5,
    compensationValue6,
    deductionValue1,
    deductionValue2,
    deductionValue3,
    deductionValue4,
    deductionValue5,
    deductionValue6,
    dividends1,
    dividends2,
    dividends3,
    dividends4,
    dividends5,
    dividends6,
    expenseReimbursementValue1,
    expenseReimbursementValue2,
    expenseReimbursementValue3,
    expenseReimbursementValue4,
    expenseReimbursementValue5,
    expenseReimbursementValue6,
    foodAllowanceValue1,
    foodAllowanceValue2,
    foodAllowanceValue3,
    foodAllowanceValue4,
    foodAllowanceValue5,
    foodAllowanceValue6,
    grossAmount1,
    grossAmount2,
    grossAmount3,
    grossAmount4,
    grossAmount5,
    grossAmount6,
    incomeTax1,
    incomeTax2,
    incomeTax3,
    incomeTax4,
    incomeTax5,
    incomeTax6,
    judicialPensionValue1,
    judicialPensionValue2,
    judicialPensionValue3,
    judicialPensionValue4,
    judicialPensionValue5,
    judicialPensionValue6,
    month4,
    month5,
    month6,
    otherDeductions1,
    otherDeductions2,
    otherDeductions3,
    otherDeductions4,
    otherDeductions5,
    otherDeductions6,
    proLabore1,
    proLabore2,
    proLabore3,
    proLabore4,
    proLabore5,
    proLabore6,
    publicPension1,
    publicPension2,
    publicPension3,
    publicPension4,
    publicPension5,
    publicPension6,
    reversalValue1,
    reversalValue2,
    reversalValue3,
    reversalValue4,
    reversalValue5,
    reversalValue6,
    transportAllowanceValue1,
    transportAllowanceValue2,
    transportAllowanceValue3,
    transportAllowanceValue4,
    transportAllowanceValue5,
    transportAllowanceValue6,
    year4,
    year5,
    year6,
  } = MontlhyIncomeDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const responsible = await prisma.legalResponsible.findUnique({
      where: {user_id}
    })
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate && !responsible) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o owner_id
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })
    if (!familyMember) {
      throw new NotAllowedError()
    }

    if (quantity === 3) {
      if (grossAmount1) {
        const liquidAmount =
          grossAmount1 -
          foodAllowanceValue1 -
          transportAllowanceValue1 -
          expenseReimbursementValue1 -
          advancePaymentValue1 -
          reversalValue1 -
          judicialPensionValue1

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount1,
            liquidAmount,
            month: month1,
            year: year1,
            advancePaymentValue: advancePaymentValue1,
            compensationValue: compensationValue1,
            deductionValue: deductionValue1,
            expenseReimbursementValue: expenseReimbursementValue1,
            familyMember_id: _id,
            incomeTax: incomeTax1,
            judicialPensionValue: judicialPensionValue1,
            otherDeductions: otherDeductions1,
            publicPension: publicPension1,
            reversalValue: reversalValue1,
            foodAllowanceValue: foodAllowanceValue1,
            transportAllowanceValue: transportAllowanceValue1,
          },
        })
      } else {
        const total = (dividends1 || 0) + (proLabore1 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount1,
            month: month1,
            year: year1,
            advancePaymentValue: advancePaymentValue1,
            compensationValue: compensationValue1,
            deductionValue: deductionValue1,
            expenseReimbursementValue: expenseReimbursementValue1,
            familyMember_id: _id,
            incomeTax: incomeTax1,
            judicialPensionValue: judicialPensionValue1,
            otherDeductions: otherDeductions1,
            publicPension: publicPension1,
            reversalValue: reversalValue1,
            foodAllowanceValue: foodAllowanceValue1,
            transportAllowanceValue: transportAllowanceValue1,
            dividends: dividends1,
            proLabore: proLabore1,
            total,
          },
        })
      }
      if (grossAmount2) {
        const liquidAmount =
          grossAmount2 -
          foodAllowanceValue2 -
          transportAllowanceValue2 -
          expenseReimbursementValue2 -
          advancePaymentValue2 -
          reversalValue2 -
          judicialPensionValue2

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount2,
            liquidAmount,
            month: month2,
            year: year2,
            advancePaymentValue: advancePaymentValue2,
            compensationValue: compensationValue2,
            deductionValue: deductionValue2,
            expenseReimbursementValue: expenseReimbursementValue2,
            familyMember_id: _id,
            incomeTax: incomeTax2,
            judicialPensionValue: judicialPensionValue2,
            otherDeductions: otherDeductions2,
            publicPension: publicPension2,
            reversalValue: reversalValue2,
            foodAllowanceValue: foodAllowanceValue2,
            transportAllowanceValue: transportAllowanceValue2,
          },
        })
      } else {
        const total = (dividends2 || 0) + (proLabore2 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount2,
            month: month2,
            year: year2,
            advancePaymentValue: advancePaymentValue2,
            compensationValue: compensationValue2,
            deductionValue: deductionValue2,
            expenseReimbursementValue: expenseReimbursementValue2,
            familyMember_id: _id,
            incomeTax: incomeTax2,
            judicialPensionValue: judicialPensionValue2,
            otherDeductions: otherDeductions2,
            publicPension: publicPension2,
            reversalValue: reversalValue2,
            foodAllowanceValue: foodAllowanceValue2,
            transportAllowanceValue: transportAllowanceValue2,
            dividends: dividends2,
            proLabore: proLabore2,
            total,
          },
        })
      }
      if (grossAmount3) {
        const liquidAmount =
          grossAmount3 -
          foodAllowanceValue3 -
          transportAllowanceValue3 -
          expenseReimbursementValue3 -
          advancePaymentValue3 -
          reversalValue3 -
          judicialPensionValue3

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount3,
            liquidAmount,
            month: month3,
            year: year3,
            advancePaymentValue: advancePaymentValue3,
            compensationValue: compensationValue3,
            deductionValue: deductionValue3,
            expenseReimbursementValue: expenseReimbursementValue3,
            familyMember_id: _id,
            incomeTax: incomeTax3,
            judicialPensionValue: judicialPensionValue3,
            otherDeductions: otherDeductions3,
            publicPension: publicPension3,
            reversalValue: reversalValue3,
            foodAllowanceValue: foodAllowanceValue3,
            transportAllowanceValue: transportAllowanceValue3,
          },
        })
      } else {
        const total = (dividends3 || 0) + (proLabore3 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount3,
            month: month3,
            year: year3,
            advancePaymentValue: advancePaymentValue3,
            compensationValue: compensationValue3,
            deductionValue: deductionValue3,
            expenseReimbursementValue: expenseReimbursementValue3,
            familyMember_id: _id,
            incomeTax: incomeTax3,
            judicialPensionValue: judicialPensionValue3,
            otherDeductions: otherDeductions3,
            publicPension: publicPension3,
            reversalValue: reversalValue3,
            foodAllowanceValue: foodAllowanceValue3,
            transportAllowanceValue: transportAllowanceValue3,
            dividends: dividends3,
            proLabore: proLabore3,
            total,
          },
        })
      }
    } else {
      if (grossAmount1) {
        const liquidAmount =
          grossAmount1 -
          foodAllowanceValue1 -
          transportAllowanceValue1 -
          expenseReimbursementValue1 -
          advancePaymentValue1 -
          reversalValue1 -
          judicialPensionValue1

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount1,
            liquidAmount,
            month: month1,
            year: year1,
            advancePaymentValue: advancePaymentValue1,
            compensationValue: compensationValue1,
            deductionValue: deductionValue1,
            expenseReimbursementValue: expenseReimbursementValue1,
            familyMember_id: _id,
            incomeTax: incomeTax1,
            judicialPensionValue: judicialPensionValue1,
            otherDeductions: otherDeductions1,
            publicPension: publicPension1,
            reversalValue: reversalValue1,
            foodAllowanceValue: foodAllowanceValue1,
            transportAllowanceValue: transportAllowanceValue1,
          },
        })
      } else {
        const total = (dividends1 || 0) + (proLabore1 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount1,
            month: month1,
            year: year1,
            advancePaymentValue: advancePaymentValue1,
            compensationValue: compensationValue1,
            deductionValue: deductionValue1,
            expenseReimbursementValue: expenseReimbursementValue1,
            familyMember_id: _id,
            incomeTax: incomeTax1,
            judicialPensionValue: judicialPensionValue1,
            otherDeductions: otherDeductions1,
            publicPension: publicPension1,
            reversalValue: reversalValue1,
            foodAllowanceValue: foodAllowanceValue1,
            transportAllowanceValue: transportAllowanceValue1,
            dividends: dividends1,
            proLabore: proLabore1,
            total,
          },
        })
      }
      if (grossAmount2) {
        const liquidAmount =
          grossAmount2 -
          foodAllowanceValue2 -
          transportAllowanceValue2 -
          expenseReimbursementValue2 -
          advancePaymentValue2 -
          reversalValue2 -
          judicialPensionValue2

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount2,
            liquidAmount,
            month: month2,
            year: year2,
            advancePaymentValue: advancePaymentValue2,
            compensationValue: compensationValue2,
            deductionValue: deductionValue2,
            expenseReimbursementValue: expenseReimbursementValue2,
            familyMember_id: _id,
            incomeTax: incomeTax2,
            judicialPensionValue: judicialPensionValue2,
            otherDeductions: otherDeductions2,
            publicPension: publicPension2,
            reversalValue: reversalValue2,
            foodAllowanceValue: foodAllowanceValue2,
            transportAllowanceValue: transportAllowanceValue2,
          },
        })
      } else {
        const total = (dividends2 || 0) + (proLabore2 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount2,
            month: month2,
            year: year2,
            advancePaymentValue: advancePaymentValue2,
            compensationValue: compensationValue2,
            deductionValue: deductionValue2,
            expenseReimbursementValue: expenseReimbursementValue2,
            familyMember_id: _id,
            incomeTax: incomeTax2,
            judicialPensionValue: judicialPensionValue2,
            otherDeductions: otherDeductions2,
            publicPension: publicPension2,
            reversalValue: reversalValue2,
            foodAllowanceValue: foodAllowanceValue2,
            transportAllowanceValue: transportAllowanceValue2,
            dividends: dividends2,
            proLabore: proLabore2,
            total,
          },
        })
      }
      if (grossAmount3) {
        const liquidAmount =
          grossAmount3 -
          foodAllowanceValue3 -
          transportAllowanceValue3 -
          expenseReimbursementValue3 -
          advancePaymentValue3 -
          reversalValue3 -
          judicialPensionValue3

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount3,
            liquidAmount,
            month: month3,
            year: year3,
            advancePaymentValue: advancePaymentValue3,
            compensationValue: compensationValue3,
            deductionValue: deductionValue3,
            expenseReimbursementValue: expenseReimbursementValue3,
            familyMember_id: _id,
            incomeTax: incomeTax3,
            judicialPensionValue: judicialPensionValue3,
            otherDeductions: otherDeductions3,
            publicPension: publicPension3,
            reversalValue: reversalValue3,
            foodAllowanceValue: foodAllowanceValue3,
            transportAllowanceValue: transportAllowanceValue3,
          },
        })
      } else {
        const total = (dividends3 || 0) + (proLabore3 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount3,
            month: month3,
            year: year3,
            advancePaymentValue: advancePaymentValue3,
            compensationValue: compensationValue3,
            deductionValue: deductionValue3,
            expenseReimbursementValue: expenseReimbursementValue3,
            familyMember_id: _id,
            incomeTax: incomeTax3,
            judicialPensionValue: judicialPensionValue3,
            otherDeductions: otherDeductions3,
            publicPension: publicPension3,
            reversalValue: reversalValue3,
            foodAllowanceValue: foodAllowanceValue3,
            transportAllowanceValue: transportAllowanceValue3,
            dividends: dividends3,
            proLabore: proLabore3,
            total,
          },
        })
      }
      if (grossAmount4) {
        const liquidAmount =
          grossAmount4 -
          foodAllowanceValue4 -
          transportAllowanceValue4 -
          expenseReimbursementValue4 -
          advancePaymentValue4 -
          reversalValue4 -
          judicialPensionValue4

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount4,
            liquidAmount,
            month: month4!,
            year: year4!,
            advancePaymentValue: advancePaymentValue4,
            compensationValue: compensationValue4,
            deductionValue: deductionValue4,
            expenseReimbursementValue: expenseReimbursementValue4,
            familyMember_id: _id,
            incomeTax: incomeTax4,
            judicialPensionValue: judicialPensionValue4,
            otherDeductions: otherDeductions4,
            publicPension: publicPension4,
            reversalValue: reversalValue4,
            foodAllowanceValue: foodAllowanceValue4,
            transportAllowanceValue: transportAllowanceValue4,
          },
        })
      } else {
        const total = (dividends4 || 0) + (proLabore4 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount4,
            month: month4!,
            year: year4!,
            advancePaymentValue: advancePaymentValue4,
            compensationValue: compensationValue4,
            deductionValue: deductionValue4,
            expenseReimbursementValue: expenseReimbursementValue4,
            familyMember_id: _id,
            incomeTax: incomeTax4,
            judicialPensionValue: judicialPensionValue4,
            otherDeductions: otherDeductions4,
            publicPension: publicPension4,
            reversalValue: reversalValue4,
            foodAllowanceValue: foodAllowanceValue4,
            transportAllowanceValue: transportAllowanceValue4,
            dividends: dividends4,
            proLabore: proLabore4,
            total,
          },
        })
      }
      if (grossAmount5) {
        const liquidAmount =
          grossAmount5 -
          foodAllowanceValue5 -
          transportAllowanceValue5 -
          expenseReimbursementValue5 -
          advancePaymentValue5 -
          reversalValue5 -
          judicialPensionValue5

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount5,
            liquidAmount,
            month: month5!,
            year: year5!,
            advancePaymentValue: advancePaymentValue5,
            compensationValue: compensationValue5,
            deductionValue: deductionValue5,
            expenseReimbursementValue: expenseReimbursementValue5,
            familyMember_id: _id,
            incomeTax: incomeTax5,
            judicialPensionValue: judicialPensionValue5,
            otherDeductions: otherDeductions5,
            publicPension: publicPension5,
            reversalValue: reversalValue5,
            foodAllowanceValue: foodAllowanceValue5,
            transportAllowanceValue: transportAllowanceValue5,
          },
        })
      } else {
        const total = (dividends5 || 0) + (proLabore5 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount5,
            month: month5!,
            year: year5!,
            advancePaymentValue: advancePaymentValue5,
            compensationValue: compensationValue5,
            deductionValue: deductionValue5,
            expenseReimbursementValue: expenseReimbursementValue5,
            familyMember_id: _id,
            incomeTax: incomeTax5,
            judicialPensionValue: judicialPensionValue5,
            otherDeductions: otherDeductions5,
            publicPension: publicPension5,
            reversalValue: reversalValue5,
            foodAllowanceValue: foodAllowanceValue5,
            transportAllowanceValue: transportAllowanceValue5,
            dividends: dividends5,
            proLabore: proLabore5,
            total,
          },
        })
      }
      if (grossAmount6) {
        const liquidAmount =
          grossAmount6 -
          foodAllowanceValue6 -
          transportAllowanceValue6 -
          expenseReimbursementValue6 -
          advancePaymentValue6 -
          reversalValue6 -
          judicialPensionValue6

        // Armazena informações acerca da renda mensal no banco de dados
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount6,
            liquidAmount,
            month: month6!,
            year: year6!,
            advancePaymentValue: advancePaymentValue6,
            compensationValue: compensationValue6,
            deductionValue: deductionValue6,
            expenseReimbursementValue: expenseReimbursementValue6,
            familyMember_id: _id,
            incomeTax: incomeTax6,
            judicialPensionValue: judicialPensionValue6,
            otherDeductions: otherDeductions6,
            publicPension: publicPension6,
            reversalValue: reversalValue6,
            foodAllowanceValue: foodAllowanceValue6,
            transportAllowanceValue: transportAllowanceValue6,
          },
        })
      } else {
        const total = (dividends6 || 0) + (proLabore6 || 0)
        // Armazena informações acerca da renda mensal no banco de dados (Empresário)
        await prisma.monthlyIncome.create({
          data: {
            grossAmount: grossAmount6,
            month: month6!,
            year: year6!,
            advancePaymentValue: advancePaymentValue6,
            compensationValue: compensationValue6,
            deductionValue: deductionValue6,
            expenseReimbursementValue: expenseReimbursementValue6,
            familyMember_id: _id,
            incomeTax: incomeTax6,
            judicialPensionValue: judicialPensionValue6,
            otherDeductions: otherDeductions6,
            publicPension: publicPension6,
            reversalValue: reversalValue6,
            foodAllowanceValue: foodAllowanceValue6,
            transportAllowanceValue: transportAllowanceValue6,
            dividends: dividends6,
            proLabore: proLabore6,
            total,
          },
        })
      }
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
