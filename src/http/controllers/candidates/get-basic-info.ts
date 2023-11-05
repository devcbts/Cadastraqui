import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getBasicInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    const user = await prisma.user.findUnique({ where: { id: user_id } })

    // Verifica se existe um candidato associado ao user_id
    const candidateFromPrisma = await prisma.candidate.findUnique({
      where: { user_id },
    })
    if (!candidateFromPrisma) {
      throw new NotAllowedError()
    }
    const email = user ? user.email : ''
    const candidate = { ...candidateFromPrisma, email }

    return reply.status(200).send({ candidate })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
