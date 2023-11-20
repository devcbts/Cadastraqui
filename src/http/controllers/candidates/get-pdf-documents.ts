import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrls } from '@/http/services/get-files'
import { getSignedUrlsGroupedByFolder } from '@/lib/S3'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getDocumentsPDF(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  
  try {
    const userId = request.user.sub

  
    const candidate = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // verifica se existe o processo seletivo

  
    

      // Encontra a inscrição
     
      const Folder = `CandidateDocuments/${candidate.id}`

      const urls = await getSignedUrlsGroupedByFolder(Folder)

      return reply.status(200).send({ urls })
   
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof AnnouncementNotExists) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
