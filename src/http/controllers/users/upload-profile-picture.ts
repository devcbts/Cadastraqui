import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadUserProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const uploadPhotoSchema = z.object({
    photoPath: z.string(),
  })

  const { photoPath } = uploadPhotoSchema.parse(request.body)
  try {
    console.log('teste', photoPath)
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const user = await prisma.user.findUnique({ where: { id: user_id } })
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const Folder = `ProfilePictures/${user_id}`
    const sended = await uploadFile(photoPath, Folder)
    if (!sended) {
      throw new NotAllowedError()
    }

    reply.status(201).send()
  } catch (error) {
    if (error instanceof NotAllowedError) {
      return reply.status(401).send()
    }
    return reply.status(500).send()
  }
}
