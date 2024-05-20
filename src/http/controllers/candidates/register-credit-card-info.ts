import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerCreditCardInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const CreditCardDataSchema = z.object({
    familyMemberName: z.string(),
    usersCount: z.number(),
    cardType: z.string(),
    bankName: z.string(),
    cardFlag: z.string(),
    invoiceValue: z.number(),
  })

  const CreditCardParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = CreditCardParamsSchema.parse(request.params)


  const {
    bankName,
    cardFlag,
    cardType,
    familyMemberName,
    invoiceValue,
    usersCount,
  } = CreditCardDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new NotAllowedError
    }

    // Verifica se existe um familiar cadastrado com o owner_id
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })
    const idField = familyMember? {familyMember_id: _id} :(candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id })


    // Armazena informações acerca do Loan no banco de dados
    await prisma.creditCard.create({
      data: {
        bankName,
        familyMemberName,
        cardFlag,
        cardType,
        invoiceValue,
        usersCount,
        ...idField
       
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
