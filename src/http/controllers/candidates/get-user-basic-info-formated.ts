import { NotAllowedError } from '@/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getBasicInfoFormated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  });

  const { _id } = queryParamsSchema.parse(request.params);
  try {
    const user_id = request.user.sub
    let candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (_id) {
      candidateOrResponsible = await ChooseCandidateResponsible(_id)
    }

    // Verifica se existe um candidato associado ao user_id
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }

    const basic_info = candidateOrResponsible.UserData
    const formated_data = {
      fullName: basic_info.name,
      workPhone: basic_info?.IdentityDetails.landlinePhone,
      CPF: basic_info.CPF,
      birthDate: basic_info.birthDate,

    }
    return reply.status(200).send({ formated_data })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
