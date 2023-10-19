import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getIdentityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({
      where: { user_id },
    })
    if (!candidate) {
      throw new NotAllowedError()
    }

    // Pega as informações de identificação associadas ao candidato logado
    const identityInfo = await prisma.identityDetails.findUnique({
      where: { candidate_id: candidate.id },
    })

    return reply.status(200).send({ identityInfo })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
