import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerMedicationInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const medicationParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === familyMemberId
  const { _id } = medicationParamsSchema.parse(request.params)

  const medicationDataSchema = z.object({
    medicationName: z.string(),
    obtainedPublicly: z.boolean().nullish(),
    specificMedicationPublicly: z.string().nullish(),
    familyMemberDiseaseId: z.string().nullish(),
  })

  const { medicationName, obtainedPublicly, specificMedicationPublicly, familyMemberDiseaseId } =
    medicationDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    // const IsUser = await SelectCandidateResponsible(user_id)
    // if (!IsUser) {
    //   throw new NotAllowedError()
    // }
    const CandidateOrResponsible = await SelectCandidateResponsible(_id)
    if (!CandidateOrResponsible) {
      const familyMember = await prisma.familyMember.findUnique({
        where: { id: _id },
      })
      if (!familyMember) {
        throw new ResourceNotFoundError()
      }
    }

    const idField = CandidateOrResponsible ? (CandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : { familyMember_id: _id }

    const { id } = await prisma.medication.create({
      data: {
        medicationName,
        obtainedPublicly: obtainedPublicly ?? false,
        ...idField,
        specificMedicationPublicly,
        familyMemberDiseaseId
      },
    })


    return reply.status(201).send({ id })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
