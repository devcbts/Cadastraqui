import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getFamilyMemberHealthInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    _id: z.string(),
  })

  const { _id } = queryParamsSchema.parse(request.params)
  try {
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })


    const isCandidateOrResponsible = await SelectCandidateResponsible(_id)
    if (!familyMember && !isCandidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    const idField = isCandidateOrResponsible ? (isCandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : { familyMember_id: _id };
    const familyMemberIncomeInfo = await prisma.familyMemberDisease.findMany({
      where: idField,
    })
    const familyMemberMedicationInfo = await prisma.medication.findMany({
      where: idField,
    })

    const healthInfo = {
      ...familyMemberIncomeInfo,
      ...familyMemberMedicationInfo,
    }
    let info = isCandidateOrResponsible ? isCandidateOrResponsible.UserData : familyMember
    return reply.status(200).send({ name: (info.fullName || info.name), id: info.id, healthInfo })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
