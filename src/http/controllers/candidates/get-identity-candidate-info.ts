import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getIdentityCandidateInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userType = request.user.role
    const userId = request.user.sub

    if (userType !== 'CANDIDATE') {
      throw new NotAllowedError()
    }

    const candidate = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    if (!candidate) {
      throw new NotAllowedError()
    }

    const identityInfo = await prisma.identityDetails.findUnique({
      where: { candidate_id: candidate.id },
    })

    return reply.status(200).send({ identityInfo })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
