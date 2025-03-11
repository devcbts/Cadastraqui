import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase, prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF } from '../../candidates/AWS Routes/get-pdf-documents-by-section'
import { getSectionDocumentsPDF_HDB } from '../AWS-routes/get-documents-by-section-HDB'

export async function getFamilyMemberInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AssistantParamsSchema = z.object({
    application_id: z.string(),
  })

  const { application_id } = AssistantParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub
    const isAssistant = await prisma.socialAssistant.findUnique({
      where: {user_id}
    })
    if (!isAssistant) {
      throw new NotAllowedError()
    }

    const familyMembers = await historyDatabase.familyMember.findMany({
      where: {application_id},
    })

    const urls = await getSectionDocumentsPDF_HDB(application_id, 'family-member')
    const familyMembersWithUrls = familyMembers.map((familyMember) => {
      const documents = Object.entries(urls).filter(([url]) => url.split("/")[3] === familyMember.id)
      return {
        ...familyMember,
        urls: Object.fromEntries(documents),
      }
    })

    return reply.status(200).send({ familyMembers: familyMembersWithUrls })

  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}