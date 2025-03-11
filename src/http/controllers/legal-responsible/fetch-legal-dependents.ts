import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchLegalDependents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchLegalDependentsSchema = z.object({
    dependent_id: z.string().optional(),
  })

  try {
    const { dependent_id } = fetchLegalDependentsSchema.parse(request.params)
    const { sub } = request.user

    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id: sub },
    })

    if (!responsible) {
      throw new NotAllowedError()
    }

    if (!dependent_id) {
      const dependents = await prisma.candidate.findMany({
        where: { responsible_id: responsible.id },
      })

      return reply.status(201).send({ dependents })
    }

    const dependent = await prisma.candidate.findUnique({
      where: { id: dependent_id },
    })

    return reply.status(201).send({ dependent })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
