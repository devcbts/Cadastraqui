import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { ROLE } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteEntity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = deleteParamsSchema.parse(request.params)

  try {
    const entity = await prisma.entity.findUnique({ where: { id: _id } })

    if (!entity) {
      throw new EntityNotExistsError()
    }

    await prisma.entity.delete({ where: { id: _id } })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof EntityNotExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
