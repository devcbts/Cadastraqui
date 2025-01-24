import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteLegalDependents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteLegalDependentsSchema = z.object({
    dependent_id: z.string().optional(),
  })

  try {
    const { dependent_id } = deleteLegalDependentsSchema.parse(request.params)
    const { sub } = request.user

    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id: sub },
    })

    if (!responsible) {
      throw new NotAllowedError()
    }

    if (!dependent_id) {
      await prisma.candidate.deleteMany({
        where: { responsible_id: responsible.id },
      })

      return reply.status(204).send()
    }

    await prisma.candidate.delete({
      where: { id: dependent_id },
    })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
