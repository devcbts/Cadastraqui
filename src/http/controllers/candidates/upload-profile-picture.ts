import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { GetUrls } from '@/http/services/get-files'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadCandidateProfilePicture(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const uploadPhotoSchema = z.object({
        photoPath: z.string(),
    })

    
    const {
        photoPath,
    } = uploadPhotoSchema.parse(request.body)
    try {
        const user_id = request.user.sub

        // Verifica se existe um candidato associado ao user_id
        const candidate = await prisma.candidate.findUnique({ where: { user_id } })
        if (!candidate) {
            throw new ResourceNotFoundError()
        }

        

        const Route = `ProfilePictures`
        const sended =  await uploadFile(candidate.id, Route)

        if (!sended){
            throw new NotAllowedError()
        }





        reply.status(201).send()
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send()
        }
        return reply.status(400).send()

    }
}