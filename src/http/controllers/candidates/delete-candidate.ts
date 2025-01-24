import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCandidadeSchema = z.object({
    candidate_id: z.string(),
  })

  try {
    const { candidate_id } = deleteCandidadeSchema.parse(request.params)

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidate_id },
    })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    const user_id = candidate.user_id!

    await prisma.candidate.delete({
      where: { id: candidate_id },
    })

    await prisma.user.delete({ where: { id: user_id } })
    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
