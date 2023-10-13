import { announcementAlreadyExists } from '@/errors/announcement-already-exists-error'
import { EntityMatrixNotExistsError } from '@/errors/entity-matrix-not-exists-errror'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateAnnoucment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    entityChanged: z.boolean(),
    branchChanged: z.boolean(),
    announcementType: z.enum(['ScholarshipGrant', 'PeriodicVerification']),
    offeredVacancies: z.number(),
    verifiedScholarships: z.number(),
    entity_matrix_id: z.string(),
    entity_subsidiary_id: z.string(),
  })

  const {
    entityChanged,
    branchChanged,
    announcementType,
    offeredVacancies,
    verifiedScholarships,
    entity_matrix_id,
    entity_subsidiary_id,
  } = registerBodySchema.parse(request.body)

  try {
    const entityMatrix = await prisma.entityMatrix.findUnique({
      where: { id: entity_matrix_id },
    })

    const entitySubsidiaryMatrix = await prisma.entitySubsidiary.findUnique({
      where: { id: entity_subsidiary_id },
    })

    if (!entityMatrix && !entitySubsidiaryMatrix) {
      throw new EntityMatrixNotExistsError()
    }

    await prisma.announcement.create({
      data: {
        entityChanged,
        branchChanged,
        announcementType,
        offeredVacancies,
        verifiedScholarships,
        entity_matrix_id,
        entity_subsidiary_id,
        announcementNumber: Math.floor(Math.random() * 1000000),
        announcementDate: new Date(),
      },
    })
  } catch (err: any) {
    if (err instanceof announcementAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
  return reply.status(201).send()
}
