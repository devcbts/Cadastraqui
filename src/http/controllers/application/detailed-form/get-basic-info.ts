import { NotAllowedError } from '@/errors/not-allowed-error';
import { historyDatabase } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getBasicInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    application_id: z.string(),
  });

  const { application_id } = queryParamsSchema.parse(request.params);
  try {
    // Verifica se existe um candidato associado ao user_id
    const basicInfoCandidate = await historyDatabase.candidate.findUnique({
      where: { application_id },
    })
    const basicInfoResponsible = await historyDatabase.legalResponsible.findUnique({
      where: { application_id },
    })

    const basicInfo = basicInfoCandidate || basicInfoResponsible
    return reply.status(200).send({ candidate: basicInfo })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
