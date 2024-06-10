import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase, prisma } from '@/lib/prisma'
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getIncomeInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    application_id: z.string(),
    _id: z.string(),
  })

  const {application_id, _id } = queryParamsSchema.parse(request.params)
  try {

    const CandidateOrResponsible = await SelectCandidateResponsibleHDB(_id)
    if (CandidateOrResponsible) {
      const idField = CandidateOrResponsible.IsResponsible? {responsible_id: CandidateOrResponsible.UserData.id} : {candidate_id: CandidateOrResponsible.UserData.id}
      const familyMemberIncomeInfo = await historyDatabase.familyMemberIncome.findMany({
        where: {...idField, application_id}
      })

      return reply.status(200).send({ familyMemberIncomeInfo })
    }
    const familyMember = await historyDatabase.familyMember.findUnique({
      where: { id: _id },
    })

    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    const familyMemberIncomeInfo = await historyDatabase.familyMemberIncome.findMany({
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
