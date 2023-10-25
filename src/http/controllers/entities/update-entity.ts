import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateEntity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateDataSchema = z.object({
    name: z.string().optional(),
    socialReason: z.string().optional(),
    logo: z.string().optional(),
    CEP: z.string().optional(),
    address: z.string().optional(),
    educationalInstitutionCode: z.string().optional(),
  })

  const updateParamsSchema = z.object({
    _id: z.string(),
  })

  const updateData = updateDataSchema.parse(request.body)

  const { _id } = updateParamsSchema.parse(request.params)
  try {
    const entity = await prisma.entity.findUnique({ where: { id: _id } })

    if (!entity) {
      throw new ResourceNotFoundError()
    }

    await prisma.entity.update({ where: { id: _id }, data: updateData })
    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
