import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateMedicationInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const medicationParamsSchema = z.object({
    _id: z.string(),
  })

  const { _id } = medicationParamsSchema.parse(request.params)

  const medicationDataSchema = z.object({
    medicationName: z.string(),
    obtainedPublicly: z.boolean(),
    specificMedicationPublicly: z.string().optional(),
  })

  const { medicationName, obtainedPublicly, specificMedicationPublicly } =
    medicationDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const IsUser = await SelectCandidateResponsible(user_id)
    if (!IsUser) {
      throw new NotAllowedError()
    }
    const medication = await prisma.medication.findUnique({
      where: { id: _id },
      select: {familyMember: true, candidate_id: true, legalResponsibleId: true}
    })
    if (!medication) {
      throw new ResourceNotFoundError()
    }
    
      const userOwner = medication.candidate_id || medication.legalResponsibleId || medication.familyMember?.candidate_id || medication.familyMember?.legalResponsibleId
      if (IsUser.UserData.id != userOwner) {
        throw new ForbiddenError()
      }

    await prisma.medication.update({
      where: { id: _id },
      data: {
        medicationName,
        obtainedPublicly,
        specificMedicationPublicly,
      },
    })

    return reply.status(200).send()

  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })
        
    }

    return reply.status(500).send({ message: err.message })
  }
}