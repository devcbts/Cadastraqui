import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteEntity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteEntitySchema = z.object({
    entity_id: z.string(),
  })

  const { entity_id } = deleteEntitySchema.parse(request.params)

  try {
    const entity = await prisma.entity.findUnique({ where: { id: entity_id } })

    if (!entity) {
      throw new EntityNotExistsError()
    }

    const entityMatrix = await prisma.entityMatrix.findUnique({
      where: { entity_id },
    })

    if (!entityMatrix) {
      await prisma.entity.delete({ where: { id: entity_id } })
      return reply.status(204).send()
    }

    // Deleta as subsidiárias
    await prisma.entitySubsidiary.deleteMany({
      where: { entity_matrix_id: entityMatrix.id },
    })

    // Deleta a matrix
    await prisma.entityMatrix.delete({ where: { entity_id } })

    // Deleta a entidade
    await prisma.entity.delete({ where: { id: entity_id } })

    // Deleta o usuário
    await prisma.user.delete({ where: { id: entity.user_id } })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof EntityNotExistsError) {
      return reply.status(404).send({ err: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
