import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getResponsibleInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id },
    })
    const dependents = await prisma.candidate.findMany({
      where: { responsible_id: responsible?.id }
    })
    if (!responsible) {
      throw new NotAllowedError()
    }

    return reply.status(200).send({ responsible, dependents })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
