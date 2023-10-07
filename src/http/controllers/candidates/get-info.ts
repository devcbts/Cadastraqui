import { NotAllowedError } from '@/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getCandidateInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userType = request.user.role
    const userId = request.user.sub

    if (userType !== 'CANDIDATE') {
      throw new NotAllowedError()
    }

    const user = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    return reply.status(200).send({ user })
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
