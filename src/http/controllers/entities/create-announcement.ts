import { announcementAlreadyExists } from '@/errors/announcement-already-exists-error'
import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
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
    entity_id: z.string(),
    entity_subsidiary_id: z.string(),
    announcementNumber: z.string()
  })

  const {
    entityChanged,
    branchChanged,
    announcementType,
    offeredVacancies,
    verifiedScholarships,
    entity_id,
    entity_subsidiary_id,
    announcementNumber
  } = registerBodySchema.parse(request.body)

  try {
    const entityMatrix = await prisma.entity.findUnique({
      where: { id: entity_id },
    })

    const entitySubsidiaryMatrix = await prisma.entitySubsidiary.findUnique({
      where: { id: entity_id },
    })

    if (!entityMatrix && !entitySubsidiaryMatrix) {
      throw new EntityNotExistsError()
    }

    await prisma.announcement.create({
      data: {
        entityChanged,
        branchChanged,
        announcementType,
        offeredVacancies,
        verifiedScholarships,
        entity_id,
        entity_subsidiary_id,
        announcementNumber,
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
