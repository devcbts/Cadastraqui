import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerFinancingInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const FinancingDataSchema = z.object({
    familyMemberName: z.string(),
    financingType: z.string(),
    installmentValue: z.number(),
    totalInstallments: z.number(),
    paidInstallments: z.number(),
    bankName: z.string(),
  })

  const FinancingParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = FinancingParamsSchema.parse(request.params)

  const {
    bankName,
    familyMemberName,
    installmentValue,
    paidInstallments,
    totalInstallments,
    financingType,
  } = FinancingDataSchema.parse(request.body)

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

    // Armazena informações acerca do Loan no banco de dados
    await prisma.financing.create({
      data: {
        bankName,
        familyMemberName,
        financingType,
        installmentValue,
        paidInstallments,
        totalInstallments,
        familyMember_id: _id,
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
