import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateLoanInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const LoanDataSchema = z.object({
    id: z.string(),
    familyMemberName: z.string(),
    installmentValue: z.number(),
    totalInstallments: z.number(),
    paidInstallments: z.number(),
    bankName: z.string(),
  })

  const LoanParamsSchema = z.object({
    _id: z.string(),
  })


  // _id === family_member_id
  const { _id } = LoanParamsSchema.parse(request.params)

  console.log('====================================');
  console.log(request.body);
  console.log('====================================');

  const {
    id,
    bankName,
    familyMemberName,
    installmentValue,
    paidInstallments,
    totalInstallments,
  } = LoanDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })

    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id }
    })

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

    // Armazena informações acerca do Loan no banco de dados
    await prisma.loan.update({
      data: {
        bankName,
        familyMemberName,
        installmentValue,
        paidInstallments,
        totalInstallments,
        familyMember_id: _id,
        candidate_id: candidate?.id,
        legalResponsibleId: responsible?.id
      },
      where: { id: id }
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
