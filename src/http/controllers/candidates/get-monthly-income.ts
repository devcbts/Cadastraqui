import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getMEIInfo(request: FastifyRequest, reply: FastifyReply) {
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

    const familyMemberIncomeInfo = await prisma.familyMemberIncome.findMany({
      where: { familyMember_id: familyMember.id },
    })

    const MEIInfoIncome = familyMemberIncomeInfo.filter(
      (familyMemberIncomeInfo) =>
        familyMemberIncomeInfo.employmentType === 'IndividualEntrepreneur',
    )
    const MEIInfo = MEIInfoIncome[0]

    return reply.status(200).send({ MEIInfo })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
