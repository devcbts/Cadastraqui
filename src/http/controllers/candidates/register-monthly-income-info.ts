import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CacheManager } from '../students/CacheManager'
const cacheManager = new CacheManager();
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
    quantity: z.number().default(0),
    incomeSource: IncomeSource,
    incomes: z.array(z.object({
      receivedIncome: z.boolean().default(true),
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
      thread_id: z.string().nullable()
    })).default([])
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

    const isCandidateOrResponsible = await SelectCandidateResponsible(_id)
    // Verifica se existe um familiar cadastrado com o owner_id

    const idField = isCandidateOrResponsible ? (isCandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : { familyMember_id: _id };

    await prisma.$transaction(async (tsPrisma) => {

      //delete all monthlyIncome linked to that user
      await tsPrisma.monthlyIncome.deleteMany({
        where: { AND: [idField, { incomeSource: monthlyIncome.incomeSource }] }
      })
      // iterate over the month array to get all total income
      await Promise.all(monthlyIncome.incomes.map(async (income) => {
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
          if (income.proLabore || income.dividends) {
            liquidAmount = income.proLabore + income.dividends
          }

          if (income.thread_id && income.judicialPensionValue === 0){
            const cachedInfo: {
             legibilidade: boolean,
             retifiedReceiver: boolean,
             grossAmount: string,
             netIncome: string,
             coherent: boolean,
             tries: number
         } | null | undefined = cacheManager.getCache(income.thread_id);
         if (cachedInfo !== null && cachedInfo !== undefined && (cachedInfo.legibilidade && cachedInfo.retifiedReceiver && cachedInfo.coherent)) {
           const objectGroosAmount = cachedInfo.grossAmount ? parseFloat(cachedInfo.grossAmount) : null;
           const objectNetIncome = cachedInfo.netIncome ? parseFloat(cachedInfo.netIncome) : null;
            if (objectGroosAmount && objectNetIncome){
              // verificar se a renda do formulário está similar a renda informada
              if (liquidAmount < objectNetIncome*0.94){
                throw new Error("Renda informada não corresponde a renda do documento");
                
              }
            }
           
         }
         }
          // Armazena informações acerca da renda mensal no banco de dados
          await tsPrisma.monthlyIncome.create({
            data: {
              receivedIncome: income.receivedIncome,
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
          await tsPrisma.monthlyIncome.create({
            data: {
              receivedIncome: income.receivedIncome,
              liquidAmount: total,
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
      }))
      // Verificar que existem todas as rendas necesárias!

      const monthlyIncomes = await tsPrisma.monthlyIncome.count({
        where: { ...idField, incomeSource: monthlyIncome.incomeSource }
      })

      // Caso existam 6 rendas mensais cadastradas, atualiza o campo isUpdated para true
      if (monthlyIncomes >= 6) {
        await tsPrisma.familyMemberIncome.updateMany({
          where: { ...idField, employmentType: monthlyIncome.incomeSource },
          data: { isUpdated: true }
        })
      }


    })




    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
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
