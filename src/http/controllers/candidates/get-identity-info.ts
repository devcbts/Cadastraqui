import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
console.log('aqui')

export async function getIdentityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  })
  const { _id } = queryParamsSchema.parse(request.params)
  try {
    const user_id = request.user.sub
    const role = request.user.role
    console.log(role)
    if (role === 'RESPONSIBLE') {
      const responsible = await prisma.legalResponsible.findUnique({
        where: {user_id: user_id}
      })
      if (!responsible) {
        throw new NotAllowedError()
      }
      const identityInfo = await prisma.identityDetails.findUnique({

        where: {responsible_id: responsible.id}
      }
      )
      if (!identityInfo) {
        throw new ResourceNotFoundError()
      }
      return reply.status(200).send({ identityInfo })
    }
    // Verifica se existe um candidato associado ao user_id
    let candidate

    if (_id) {
      candidate = await prisma.candidate.findUnique({
        where: { id: _id },
      })
    } else {
      // Verifica se existe um candidato associado ao user_id
      candidate = await prisma.candidate.findUnique({
        where: { user_id },
      })
    }

    if (!candidate) {
      throw new ResourceNotFoundError()
    }
    // Pega as informações de identificação associadas ao candidato logado
    const identityInfo = await prisma.identityDetails.findUnique({
      where: { candidate_id: candidate.id },
    })

    return reply.status(200).send({ identityInfo })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
