import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod';

export async function getBasicInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  });

  const { _id } = queryParamsSchema.parse(request.params);
  try {
    const user_id = request.user.sub
    const role = request.user.role
    if (role === 'RESPONSIBLE') {
      const responsible = prisma.legalResponsible.findUnique({

        where: {user_id}
      }
      )
      if (!responsible) {
        throw new ResourceNotFoundError()
      }
      const candidate = responsible
      return reply.status(200).send({ candidate })
    }

    let candidate;

    if (_id) {
      candidate = await prisma.candidate.findUnique({
        where: { id: _id },
      })


    } else {

      // Verifica se existe um candidato associado ao user_id

      const user = await prisma.user.findUnique({ where: { id: user_id } })
      const candidateFromPrisma = await prisma.candidate.findUnique({
        where: { user_id },
      })
      if (!candidateFromPrisma) {
        throw new NotAllowedError()
      }
      const email = user ? user.email : ''
      const candidate = { ...candidateFromPrisma, email }
      return reply.status(200).send({ candidate })

    }
    // Verifica se existe um candidato associado ao user_id
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    return reply.status(200).send({ candidate })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
