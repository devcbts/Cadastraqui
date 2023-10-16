import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SubsidiaryNotExistsError } from '@/errors/subsidiary-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateDirector(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateDataSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    CPF: z.string().optional(),
  })
  const updateParamsSchema = z.object({
    _id: z.string(),
  })

  const updatedData = updateDataSchema.parse(request.body)

  const { _id } = updateParamsSchema.parse(request.params)

  try {
    const director = await prisma.entityDirector.findUnique({
      where: { id: _id },
    })

    if (!director) {
      throw new ResourceNotFoundError()
    }

    await prisma.entityDirector.update({
      where: { id: _id },
      data: updatedData,
    })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
