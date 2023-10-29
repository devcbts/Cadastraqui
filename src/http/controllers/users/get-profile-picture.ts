import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrl } from '@/http/services/get-file'
import { GetUrls } from '@/http/services/get-files'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getUserProfilePicture(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const user = await prisma.user.findUnique({ where: { id: user_id } })
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const Route = `ProfilePictures/${user_id}`

    const url = await GetUrl(Route)

    reply.status(201).send({ url })
  } catch (error) {
    if (error instanceof NotAllowedError) {
      return reply.status(401).send()
    }
    return reply.status(400).send()
  }
}
