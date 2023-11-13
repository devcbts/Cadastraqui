import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getExpensesInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub;

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({
      where: { user_id },
    });
    if (!candidate) {
      throw new ResourceNotFoundError();
    }

    // Busca todas as despesas associadas ao candidato
    const expenses = await prisma.expense.findMany({
      where: { candidate_id: candidate.id },
    });

    

    return reply.status(200).send({expenses});
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    return reply.status(500).send({ message: err.message });
  }
}