import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma, historyDatabase } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from '../AWS-routes/get-documents-by-section-HDB'

export async function getIdentityInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    application_id: z.string(),
  })
  const { application_id } = queryParamsSchema.parse(request.params)
  try {
    const user_id = request.user.sub
    
    const isAssistant = await prisma.socialAssistant.findUnique({
        where: {user_id}
    })
    if (!isAssistant) {
        throw new NotAllowedError()
        
    }

    // Pega as informações de identificação associadas ao candidato logado
    const identityInfo = await historyDatabase.identityDetails.findUnique({
      where: {application_id},
      include: { candidate: true, responsible: true }
    })
    const uid = identityInfo?.candidate ? identityInfo?.candidate_id : identityInfo?.responsible_id
    const urls = await getSectionDocumentsPDF_HDB(application_id ,'identity')
    return reply.status(200).send({ identityInfo: !!identityInfo ? { ...(identityInfo?.candidate || identityInfo?.responsible), ...identityInfo, uid } : null, urls })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
