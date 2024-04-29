import { NotAllowedError } from '@/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma } from '@/lib/prisma';
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getFinancingInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O _id do familiar é opcional
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  });

  const {_id} = queryParamsSchema.parse(request.params);

  try {
    const user_id = request.user.sub
    let candidateOrResponsible 
    let idField
    if (_id) {
      candidateOrResponsible = await ChooseCandidateResponsible(_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? {legalResponsibleId: candidateOrResponsible.UserData.id} : {candidate_id: candidateOrResponsible.UserData.id}
    } else {
      // Verifica se existe um candidato associado ao user_id
      candidateOrResponsible = await SelectCandidateResponsible(user_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? {legalResponsibleId: candidateOrResponsible.UserData.id} : {candidate_id: candidateOrResponsible.UserData.id}
    }

    // Busca as informações de financiamento no banco de dados
    const financings = await prisma.financing.findMany({
      where: idField,
    });

    return reply.status(200).send({financings});
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    return reply.status(500).send({ message: err.message });
  }
}
