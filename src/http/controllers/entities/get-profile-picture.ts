import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getEntityProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsData = z.object({
    _id: z.string().optional()
  })

  const { _id } = requestParamsData.parse(request.params)
  try {
    const user_id = request.user.sub
    // Verifica se existe um candidato associado ao user_id
    let entity
    let entitySubsidiary
    if (_id) {
      entity = await prisma.entity.findUnique({ where: { user_id: _id } })

     entitySubsidiary = await prisma.entitySubsidiary.findUnique({ where: { user_id : _id} })

    }else{

      entity = await prisma.entity.findUnique({ where: { user_id } })
      
      entitySubsidiary = await prisma.entitySubsidiary.findUnique({ where: { user_id } })
    }

    if (!entity && !entitySubsidiary) {
      throw new ResourceNotFoundError()
    }

        if (entity) {
            
            const Route = `ProfilePictures/${entity.id}`
            const url = await GetUrl(Route)

       
            reply.status(200).send({ url })
        }
        if (entitySubsidiary) {
            const Route = `ProfilePictures/${entitySubsidiary.id}`
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
