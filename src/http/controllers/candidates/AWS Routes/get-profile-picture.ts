import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getCandidateProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidateOrResponsible = await SelectCandidateResponsible(user_id);
    if (!candidateOrResponsible) {
      throw new ForbiddenError()
    }

    const Route = `ProfilePictures/${candidateOrResponsible.UserData.id}`

    const url = await GetUrl(Route)

    reply.status(200).send({ url })
  } catch (error) {
    if (error instanceof NotAllowedError) {
      return reply.status(401).send()
    }
    return reply.status(500).send()
  }
}
