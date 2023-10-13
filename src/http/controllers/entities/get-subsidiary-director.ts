import { SubsidiaryNotExistsError } from '@/errors/subsidiary-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getSubsidiaryDirector(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getSubsidiaryDirectorParamsSchema = z.object({
    entity_subsidiary_id: z.string(),
  })

  const { entity_subsidiary_id } = getSubsidiaryDirectorParamsSchema.parse(
    request.params,
  )

  try {
    const subsidiary = await prisma.entitySubsidiary.findUnique({
      where: { id: entity_subsidiary_id },
    })

    if (!subsidiary) {
      throw new SubsidiaryNotExistsError()
    }

    const subsidiaryDirector = await prisma.entityDirector.findUnique({
      where: { entity_subsidiary_id },
    })

    return reply.status(200).send({ subsidiaryDirector })
  } catch (err: any) {
    if (err instanceof SubsidiaryNotExistsError) {
      reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
