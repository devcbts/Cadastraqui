import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getCreditCardInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O _id do familiar é opcional
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  });

  const queryParams = queryParamsSchema.parse(request.query);

  try {
    const user_id = request.user.sub;

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } });
    if (!candidate) {
      throw new ResourceNotFoundError();
    }

    // Constrói a condição de pesquisa baseada na presença do _id
    const searchCondition = queryParams._id
      ? { familyMember_id: queryParams._id }
      : {};

    // Busca as informações de cartões de crédito no banco de dados
    const creditCards = await prisma.creditCard.findMany({
      where: {
        ...searchCondition,
        candidate_id: candidate.id,
      },
    });

    return reply.status(200).send({creditCards});
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    return reply.status(500).send({ message: err.message });
  }
}
