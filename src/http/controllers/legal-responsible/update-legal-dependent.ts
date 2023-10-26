import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateLegalDependent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateDataSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    CPF: z.string().optional(),
    dateOfBirth: z.string().optional(),
  })
  const updateParamsSchema = z.object({
    _id: z.string(),
  })

  const updatedData = updateDataSchema.parse(request.body)

  // _id === legalDependent_id
  const { _id } = updateParamsSchema.parse(request.params)

  try {
    const dependent = await prisma.candidate.findUnique({
      where: { id: _id },
    })

    if (!dependent) {
      throw new ResourceNotFoundError()
    }

    await prisma.candidate.update({
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
