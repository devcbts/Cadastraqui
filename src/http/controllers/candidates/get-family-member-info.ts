import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getFamilyMemberInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AssistantParamsSchema = z.object({
    _id: z.string().optional(),
  })

  // _id === familyMember_id
  const { _id } = AssistantParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub
    let candidateOrResponsible 
    let idField
    if (_id) {
      candidateOrResponsible = await ChooseCandidateResponsible(_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? {legalResponsibleId: candidateOrResponsible.UserData.id} : {candidate_id: candidateOrResponsible.UserData.id}
    } else {
      // Verifica se existe um candidato associado ao user_id
      candidateOrResponsible = await SelectCandidateResponsible(user_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? {legalResponsibleId: candidateOrResponsible.UserData.id} : {candidate_id: candidateOrResponsible.UserData.id}
    }

    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
    })
    return reply.status(200).send({ familyMembers })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
