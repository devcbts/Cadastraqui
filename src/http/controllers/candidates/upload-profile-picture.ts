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
 
    try {
        const user_id = request.user.sub
        // Verifica se existe um candidato associado ao user_id
        const candidate = await prisma.candidate.findUnique({ where: { user_id } })
        if (!candidate) {
            throw new ResourceNotFoundError()
        }

        const data = await request.file();
        if (!data) {
            throw new ResourceNotFoundError()
        }
        const fileBuffer = await data.toBuffer();
        console.log(fileBuffer.length)
        const Route = `ProfilePictures/${candidate.id}`
        const sended =  await uploadFile(fileBuffer, Route)
      
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