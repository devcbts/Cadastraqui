import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { getSignedUrlsGroupedByFolder } from '@/lib/S3'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getDocumentsPDF(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsData = z.object({
    _id: z.string().optional()
  })

  const { _id } = requestParamsData.parse(request.params)
  try {
    const userId = request.user.sub
    const responsible = await prisma.legalResponsible.findUnique(({
      where: { user_id: userId }
    }))
    let candidate
    if (_id) {
      candidate = await prisma.candidate.findUnique({
        where: { id: _id },
      })
    }
    else {

      candidate = await prisma.candidate.findUnique({
        where: { user_id: userId },
      })
    }


    // verifica se existe o processo seletivo



    let Folder
    // Encontra a inscrição
    if (candidate) {

      Folder = `CandidateDocuments/${candidate.id}`
    }
    else if (responsible) {
      Folder = `CandidateDocuments/${responsible.id}`

    } else {
      throw new ResourceNotFoundError()

    }
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

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
