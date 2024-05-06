import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerLoanInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const LoanDataSchema = z.object({
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

  const {
    bankName,
    familyMemberName,
    installmentValue,
    paidInstallments,
    totalInstallments,
  } = LoanDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    let IsUser = await SelectCandidateResponsible(user_id)
    // Verifica se existe um candidato associado ao user_id
    if (!IsUser) {
      throw new NotAllowedError()
    }
    const CandidateOrResponsible = await SelectCandidateResponsible(_id)

    const familyMember = await prisma.familyMember.findUnique({
      where: {id: _id}
    })
    

    const idField = CandidateOrResponsible ? (CandidateOrResponsible?.IsResponsible ? {legalresponsible_id: _id} : {candidate_id: _id}) : {familyMember_id: _id} 
    await prisma.loan.create({
      data: {
        bankName,
        familyMemberName,
        installmentValue,
        paidInstallments,
        totalInstallments,
        ...idField
      },
    })
  
     
    // Verifica se existe um familiar cadastrado com o owner_id
   

    
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
