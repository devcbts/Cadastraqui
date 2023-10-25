import { downloadFile } from '@/http/services/download-file'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function downloadDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const uploadDocumentSchema = z.object({
    fileNameInBucket: z.string(),
    localSavePath: z.string(),
  })

  const { fileNameInBucket, localSavePath } = uploadDocumentSchema.parse(
    request.body,
  )
  try {
    downloadFile(fileNameInBucket, localSavePath)
    reply.status(201).send()
  } catch (error) {
    return reply.status(400).send()
  }
}
