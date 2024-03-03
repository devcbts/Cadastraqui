import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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
    obtainedPublicly: z.boolean(),
    specificMedicationPublicly: z.string().optional(),
  })

  const { medicationName, obtainedPublicly, specificMedicationPublicly } =
    medicationDataSchema.parse(request.body)

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
        const familyMember = await prisma.familyMember.findUnique({
          where: { id: _id },
        })
        if (!familyMember) {
          throw new NotAllowedError()
        }
    
        // Armazena informações acerca do veículo no banco de dados
        await prisma.medication.create({
          data: {
            medicationName,
            obtainedPublicly,
            familyMember_id: _id,
            specificMedicationPublicly,
          },
        })
        return reply.status(201).send()
      
    }
    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o familyMember_id

    const familyMember = await prisma.familyMember.findFirst({
      where: { candidate_id: candidate.id, id: _id },
    })
    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    // Armazena informações acerca do veículo no banco de dados
    await prisma.medication.create({
      data: {
        medicationName,
        obtainedPublicly,
        familyMember_id: _id,
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
