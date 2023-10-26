import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadSolicitationDocument(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const uploadDocumentSchema = z.object({
        documentPath: z.string(),
    })
    const uploadParamsSchema = z.object({
        solicitation_id: z.string()
    })

    const { solicitation_id } = uploadParamsSchema.parse(request.params)
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

        const solicitation = await prisma.applicationHistory.findUnique({ where: { id: solicitation_id } })

        if (!solicitation) {
            throw new ResourceNotFoundError()

        }


        const application = await prisma.application.findUnique({
            where: {id: solicitation.application_id}
        })

        if (candidate.id != application?.candidate_id) {
            throw new NotAllowedError()
        }


        const Folder = `SolicitationDocuments/${application.id}/${solicitation_id}`
        const response = await uploadFile(documentPath, Folder)

        if (response) {
            await prisma.applicationHistory.update({
                where:{ id: solicitation_id},
                data: {answered : true}
            })   
        }

        reply.status(201).send()
    } catch (error) {
        return reply.status(400).send()
    }
}