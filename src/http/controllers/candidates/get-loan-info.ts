import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getLoanInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O _id do familiar é opcional
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = queryParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    // Verifica se existe um candidato associado ao user_id
    const role = request.user.role
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

    // Constrói a condição de pesquisa baseada na presença do _id

    // Busca as informações de Loan no banco de dados
    const loans = await prisma.loan.findMany({
      where: {
        familyMember: {
          candidate_id: candidate.id,
        },
      },
    })

    return reply.status(200).send({ loans })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
