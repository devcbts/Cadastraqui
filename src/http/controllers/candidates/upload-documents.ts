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
    })

    
    const {
        documentPath,
    } = uploadDocumentSchema.parse(request.body)
    try {
        const user_id = request.user.sub

        // Verifica se existe um candidato associado ao user_id
        const candidate = await prisma.candidate.findUnique({ where: { user_id } })
        if (!candidate) {
            throw new ResourceNotFoundError()
        }

        

        const Folder = `CandidatesDocuments/${candidate.id}`
        uploadFile(documentPath, Folder)

        reply.status(201).send()
    } catch (error) {
        return reply.status(400).send()
    }
}