import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { prisma } from '@/lib/prisma'
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

    await prisma.entityDirector.deleteMany({ where: { entity_id: entity.id } })
    await prisma.entitySubsidiary.deleteMany({
      where: { entity_id: entity.id },
    })

    await prisma.entity.delete({ where: { id: _id } })

    await prisma.user.delete({ where: { id: entity.user_id } })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof EntityNotExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
