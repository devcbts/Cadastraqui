import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerFinancingInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const FinancingType = z.enum(['Car',
    'Motorcycle',
    'Truck',
    'House_Apartment_Land',
    'Other'])

  const FinancingDataSchema = z.object({
    familyMemberName: z.string(),
    financingType: FinancingType,
    installmentValue: z.number(),
    totalInstallments: z.number(),
    paidInstallments: z.number(),
    bankName: z.string(),
    otherFinancing: z.string().optional(),
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
    otherFinancing
  } = FinancingDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const IsUser = await SelectCandidateResponsible(user_id)
    if (!IsUser) {
      throw new NotAllowedError()
    }
    const CandidateOrResponsible = await SelectCandidateResponsible(_id)
    let idField = {}
    if (!CandidateOrResponsible) {
      const familyMember = await prisma.familyMember.findUnique({
        where: { id: _id },
      })
      if (!familyMember) {
        throw new ResourceNotFoundError()
      }
      idField = { familyMember_id: _id }
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
        otherFinancing,

        ...(IsUser ? (IsUser.IsResponsible ? { legalResponsible_id: _id } : { candidate_id: _id }) : idField)
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

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
