import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerExpensesInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const ExpensesDataSchema = z.object({
    expenses: z.array(
      z.object({
        date: z.string().or(z.date()).transform(v => new Date(v)),
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
        financing: z.optional(z.number()),
        creditCard: z.optional(z.number()),
        otherExpensesValue: z.optional(z.array(z.number())),
        otherExpensesDescription: z.optional(z.array(z.string())),
        totalExpense: z.optional(z.number()),
      })
    )
  }
  )



  const { expenses } = ExpensesDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ForbiddenError()
    }
    // get the current user role to set the correct id
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    //clean all expenses from the current user
    const oldestExpense = await prisma.expense.findFirst({
      where: { ...idField },
      orderBy: { date: 'asc' },
    })

    if (oldestExpense) {
      await prisma.expense.delete({
      where: { id: oldestExpense.id },
      })
    }
    expenses.forEach(async (expense) => {
      const {
        date,
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
        financing,
        creditCard,
        rent,
        streamingServices,
        waterSewage,
      } = expense

      // Armazena informações acerca das despesas do candidato
      await prisma.expense.create({
        data: {
          date,
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
          ...idField,
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
          financing,
          creditCard
        },
      })
    })
    await prisma.finishedRegistration.upsert({
      where: idField,
      create: { grupoFamiliar: true, ...idField },
      update: {
        despesas: true,
      }
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
