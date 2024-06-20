import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getSocialAssistants(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('Chegou na função')
  try {
    const userId = request.user.sub
    console.log("Cheguei aqui")
    if (!userId) {
      throw new NotAllowedError()
    }

    const entity = await prisma.entity.findUnique({
      where: {
        user_id: userId
      }
    })

    if (!entity) {
      throw new ResourceNotFoundError();
    }

    // Busca no banco de dados todos os assistentes sociais associados à entidade
    const socialAssistants = await prisma.socialAssistant.findMany({
      where: {
        entity_id: entity.id
      },
      include: {
        user: { select: { email: true } }
      }

    })

    // Retorna os assistentes sociais encontrados
    return reply.status(200).send({ socialAssistants: socialAssistants.map(e => ({ ...e, email: e.user.email })) })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })

    }
    return reply.status(500).send({ message: err.message })
  }
}
