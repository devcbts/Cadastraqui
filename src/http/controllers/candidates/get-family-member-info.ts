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
    const role = request.user.role
    if (role === 'RESPONSIBLE') {
      const responsible = await prisma.legalResponsible.findUnique({
        where: { user_id}
      })
      if (!responsible) {
        throw new NotAllowedError()
      }
      const familyMembers = await prisma.familyMember.findMany({
        where: { legalResponsibleId: responsible.id },
      })
      return reply.status(200).send({ familyMembers })
    }
    let CandidateOrResponsible
    let IdField
    if (_id) {
       CandidateOrResponsible = await ChooseCandidateResponsible(_id)
      if (!CandidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
       IdField = CandidateOrResponsible.IsResponsible ? { legalResponsibleId: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id }



    } else {
      // Verifica se existe um candidato associado ao user_id
      CandidateOrResponsible = await prisma.candidate.findUnique({
        where: { user_id },
      })
    }
    if (!CandidateOrResponsible) {
      throw new ResourceNotFoundError()
    }

    const familyMembers = await prisma.familyMember.findMany({
      where: IdField,
    })
    return reply.status(200).send({ familyMembers })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
