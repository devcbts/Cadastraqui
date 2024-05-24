import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function uploadUserProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub
    // Verifica se existe um candidato associado ao user_id
    const data = await request.file();
    if (!data) {
      throw new ResourceNotFoundError()
    }
    const fileBuffer = await data.toBuffer();

    const Route = `ProfilePictures/${user_id}`
    const sended = await uploadFile(fileBuffer, Route)

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
