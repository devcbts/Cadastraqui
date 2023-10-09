import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchEntities(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const entities = await prisma.entity.findMany()

    return reply.status(201).send({ entities })
  } catch (err: any) {
    return reply.status(500).send({ message: err.message })
  }
}
