import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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

    const candidate = await prisma.candidate.findUnique({
      where: {id: _id}
    })
    if (candidate) {
      const familyMemberIncomeInfo = await prisma.familyMemberIncome.findMany({
        where: { candidate_id: candidate.id },
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
