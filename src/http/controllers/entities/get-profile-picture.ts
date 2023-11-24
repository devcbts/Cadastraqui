import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getEntityProfilePicture(
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

        if (entity) {
            
            const Route = `ProfilePictures/${entity.id}`
            const url = await GetUrl(Route)

       
            reply.status(200).send({ url })
        }
        if (entitySubisidary) {
            const Route = `ProfilePictures/${entitySubisidary.id}`
            const url = await GetUrl(Route)

       
            reply.status(200).send({ url })
        }





  } catch (error) {
    if (error instanceof NotAllowedError) {
      return reply.status(401).send()
    }
    return reply.status(500).send()
  }
}
