import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { prisma, historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible';
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from 'fastify'
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
    const user_id = request.user.sub
    const isAssistant = await prisma.socialAssistant.findUnique({
        where: {user_id}
    })
    if (!isAssistant) {
        throw new NotAllowedError()
        
    }
    
    // Verifica se existe um candidato associado ao user_id
    const basicInfoCandidate = await historyDatabase.candidate.findUnique({
        where: {application_id},
    })
    const basicInfoResponsible = await historyDatabase.legalResponsible.findUnique({
        where: {application_id},
    })

    const basicInfo = basicInfoCandidate || basicInfoResponsible
    return reply.status(200).send({ candidate: basicInfo })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
