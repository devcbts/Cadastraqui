import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
export async function getHousingInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const AssistantParamsSchema = z.object({
    _id: z.string().optional(),
  })

  // _id === familyMember_id
  const { _id } = AssistantParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub;
    const role = request.user.role;

    let candidate;
    
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
      throw new NotAllowedError()
    }
    const housingInfo = await prisma.housing.findUnique({
      where: { candidate_id: candidate.id },
    })

    return reply.status(200).send({ housingInfo })
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
