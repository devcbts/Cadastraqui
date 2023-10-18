import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadDocument(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const uploadDocumentSchema = z.object({
        documentPath: z.string(),
        documentFolder: z.string(),
    })

    const {
        documentPath,
        documentFolder
    } = uploadDocumentSchema.parse(request.body)
    try 
    {
        uploadFile(documentPath, documentFolder)
        reply.status(201).send()
    } catch (error) {
        return reply.status(400).send()
    }
}