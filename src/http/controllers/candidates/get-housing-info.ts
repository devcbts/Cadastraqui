import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'
export async function getHousingInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {


  try {
    const user_id = request.user.sub;

    let candidateOrResponsible
    let idField


    // Verifica se existe um candidato associado ao user_id
    candidateOrResponsible = await SelectCandidateResponsible(user_id)

    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    idField = candidateOrResponsible.IsResponsible ? { responsible_id: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }


    const housingInfo = await prisma.housing.findUnique({
      where: idField,
    })
    const uid = candidateOrResponsible.UserData.id
    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'housing')
    return reply.status(200).send({ housingInfo, urls, uid })
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
