import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerExpensesInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const ExpensesDataSchema = z.object({
    month: z.string(),
    waterSewage: z.optional(z.number()),
    electricity: z.optional(z.number()),
    landlinePhone: z.optional(z.number()),
    mobilePhone: z.optional(z.number()),
    food: z.optional(z.number()),
    rent: z.optional(z.number()),
    garageRent: z.optional(z.number()),
    condominium: z.optional(z.number()),
    cableTV: z.optional(z.number()),
    streamingServices: z.optional(z.number()),
    fuel: z.optional(z.number()),
    annualIPVA: z.optional(z.number()),
    optedForInstallmentIPVA: z.optional(z.boolean()),
    installmentCountIPVA: z.optional(z.number()),
    installmentValueIPVA: z.optional(z.number()),
    annualIPTU: z.optional(z.number()),
    optedForInstallmentIPTU: z.optional(z.boolean()),
    installmentCountIPTU: z.optional(z.number()),
    installmentValueIPTU: z.optional(z.number()),
    annualITR: z.optional(z.number()),
    optedForInstallmentITR: z.optional(z.boolean()),
    installmentCountITR: z.optional(z.number()),
    installmentValueITR: z.optional(z.number()),
    annualIR: z.optional(z.number()),
    optedForInstallmentIR: z.optional(z.boolean()),
    installmentCountIR: z.optional(z.number()),
    installmentValueIR: z.optional(z.number()),
    INSS: z.optional(z.number()),
    publicTransport: z.optional(z.number()),
    schoolTransport: z.optional(z.number()),
    internet: z.optional(z.number()),
    courses: z.optional(z.number()),
    healthPlan: z.optional(z.number()),
    dentalPlan: z.optional(z.number()),
    medicationExpenses: z.optional(z.number()),
    otherExpensesValue: z.optional(z.array(z.number())),
    otherExpensesDescription: z.optional(z.array(z.string())),
    totalExpense: z.optional(z.number()),
  })


  console.log('====================================');
  console.log(request.body);
  console.log('====================================');
  const {
    month,
    INSS,
    publicTransport,
    schoolTransport,
    internet,
    courses,
    healthPlan,
    dentalPlan,
    medicationExpenses,
    otherExpensesValue,
    otherExpensesDescription,
    totalExpense,
    annualIPTU,
    annualIPVA,
    annualIR,
    annualITR,
    cableTV,
    condominium,
    electricity,
    food,
    fuel,
    garageRent,
    installmentCountIPVA,
    installmentValueIPVA,
    optedForInstallmentIPVA,
    installmentCountIPTU,
    installmentValueIPTU,
    optedForInstallmentIPTU,
    installmentCountITR,
    installmentValueITR,
    optedForInstallmentITR,
    installmentCountIR,
    installmentValueIR,
    optedForInstallmentIR,
    landlinePhone,
    mobilePhone,
    
    rent,
    streamingServices,
    waterSewage,
  } = ExpensesDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se já existe um  cadastro de despesa com o RG ou CPF associados ao candidato
    

    // Armazena informações acerca das despesas do candidato
    await prisma.expense.create({
      data: {
        month,
        annualIPTU,
        annualIPVA,
        annualIR,
        annualITR,
        cableTV,
        condominium,
        courses,
        dentalPlan,
        electricity,
        food,
        fuel,
        garageRent,
        healthPlan,
        INSS,
        installmentCountIPVA,
        installmentValueIPVA,
        optedForInstallmentIPVA,
        installmentCountIPTU,
        installmentValueIPTU,
        optedForInstallmentIPTU,
        installmentCountITR,
        installmentValueITR,
        optedForInstallmentITR,
        installmentCountIR,
        installmentValueIR,
        optedForInstallmentIR,
        landlinePhone,
        internet,
        candidate_id: candidate.id,
        mobilePhone,
        publicTransport,
        rent,
        schoolTransport,
        streamingServices,
        totalExpense,
        otherExpensesValue,
        otherExpensesDescription,
        medicationExpenses,
        waterSewage,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
