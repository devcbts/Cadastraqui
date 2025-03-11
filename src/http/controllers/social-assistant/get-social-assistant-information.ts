import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getBasicAssistantInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const assistant = await prisma.socialAssistant.findUnique({
      where: { user_id },
      include: {
        user: true
      }
    })
    if (!assistant) {
      throw new NotAllowedError()
    }

    return reply.status(200).send({ assistant: { ...assistant, ...assistant.user } })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
