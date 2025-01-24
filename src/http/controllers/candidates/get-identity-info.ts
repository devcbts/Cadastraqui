import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'
console.log('aqui')

export async function getIdentityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  try {
    const user_id = request.user.sub
    let candidateOrResponsible
    let idField
    console.log('user_id', user_id)
    candidateOrResponsible = await SelectCandidateResponsible(user_id);
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    idField = candidateOrResponsible.IsResponsible ? { responsible_id: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }




    // Pega as informações de identificação associadas ao candidato logado
    const identityInfo = await prisma.identityDetails.findUnique({
      where: idField,
      include: { candidate: true, responsible: true }
    })
    const uid = identityInfo?.candidate ? identityInfo?.candidate_id : identityInfo?.responsible_id
    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'identity')
    return reply.status(200).send({ identityInfo: !!identityInfo ? { ...(identityInfo?.candidate || identityInfo?.responsible), ...identityInfo, uid } : null, urls })
  } catch (err: any) {
    console.log(err)
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    console.log(err)
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
