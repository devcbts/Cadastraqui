import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerMedicationInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const medicationDataSchema = z.object({
    medicationName: z.string(),
    obtainedPublicly: z.boolean(),
    specificMedicationPublicly: z.string().optional(),
    familyMember_id: z.string(),
  })

  const {
    familyMember_id,
    medicationName,
    obtainedPublicly,
    specificMedicationPublicly,
  } = medicationDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o familyMember_id

    const familyMember = await prisma.familyMember.findFirst({
      where: { candidate_id: candidate.id, id: familyMember_id },
    })
    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    // Armazena informações acerca do veículo no banco de dados
    await prisma.medication.create({
      data: {
        medicationName,
        obtainedPublicly,
        familyMember_id,
        specificMedicationPublicly,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
