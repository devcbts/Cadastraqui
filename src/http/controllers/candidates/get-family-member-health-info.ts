import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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

    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    const familyMemberIncomeInfo = await prisma.familyMemberDisease.findMany({
      where: { familyMember_id: familyMember.id },
    })
    const familyMemberMedicationInfo = await prisma.medication.findFirst({
      where: { familyMember_id: familyMember.id },
    })

    const healthInfo = {
      ...familyMemberIncomeInfo,
      ...familyMemberMedicationInfo,
    }

    return reply.status(200).send({ healthInfo })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
