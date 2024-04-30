import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getIncomeInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    _id: z.string(),
  })

  const { _id } = queryParamsSchema.parse(request.params)
  try {

    const CandidateOrResponsible = await SelectCandidateResponsible(_id)
    if (CandidateOrResponsible) {
      const idField = CandidateOrResponsible.IsResponsible? {responsible_id: CandidateOrResponsible.UserData.id} : {candidate_id: CandidateOrResponsible.UserData.id}
      const familyMemberIncomeInfo = await prisma.familyMemberIncome.findMany({
        where: idField
      })

      return reply.status(200).send({ familyMemberIncomeInfo })
    }
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })

    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    const familyMemberIncomeInfo = await prisma.familyMemberIncome.findMany({
      where: { familyMember_id: familyMember.id },
    })

    return reply.status(200).send({ familyMemberIncomeInfo })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
