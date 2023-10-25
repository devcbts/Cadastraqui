import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getFamilyMemberInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const familyMemberParamsSchema = z.object({
    _id: z.string().optional(),
  })

  // _id === familyMember_id
  const { _id } = familyMemberParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({
      where: { user_id },
    })
    if (!candidate) {
      throw new NotAllowedError()
    }

    if (!_id) {
      const familyMembers = await prisma.familyMember.findMany({
        where: { candidate_id: candidate.id },
      })
      return reply.status(200).send({ familyMembers })
    } else {
      const familyMember = await prisma.familyMember.findUnique({
        where: { id: _id },
      })
      return reply.status(200).send({ familyMember })
    }
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
