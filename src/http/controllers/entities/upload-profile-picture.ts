import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function uploadEntityProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub
    // Verifica se existe um candidato associado ao user_id
    const entity = await prisma.entity.findUnique({ where: { user_id } })

    const entitySubisidary = await prisma.entitySubsidiary.findUnique({ where: { user_id } })

    if (!entity && !entitySubisidary) {
      throw new ResourceNotFoundError()
    }

        const data = await request.file();
        if (!data) {
            throw new ResourceNotFoundError()
        }
        const fileBuffer = await data.toBuffer();
        console.log(fileBuffer.length)
        
        if (entity) {
            
            const Route = `ProfilePictures/${entity.id}`
            const sended =  await uploadFile(fileBuffer, Route)
            if (!sended){
                
                throw new NotAllowedError()
            }
        }
        if (entitySubisidary) {
            const Route = `ProfilePictures/${entitySubisidary.id}`
            const sended =  await uploadFile(fileBuffer, Route)

            
            if (!sended){
                
                throw new NotAllowedError()
            }
        }





    reply.status(201).send()
  } catch (error) {
    if (error instanceof NotAllowedError) {
      return reply.status(401).send()
    }
    return reply.status(500).send()
  }
}
