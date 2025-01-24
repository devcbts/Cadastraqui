import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from "../../social-assistant/AWS-routes/get-documents-by-section-HDB"
export async function getHousingInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const AssistantParamsSchema = z.object({
    application_id: z.string(),
  })


  const { application_id } = AssistantParamsSchema.parse(request.params)

  try {

    const housingInfo = await historyDatabase.housing.findUnique({
      where: { application_id },
    })
    const urls = await getSectionDocumentsPDF_HDB(application_id, 'housing')
    return reply.status(200).send({ housingInfo, urls })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
