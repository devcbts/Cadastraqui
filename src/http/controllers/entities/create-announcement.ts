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
    entity_id: z.string().optional(),
    entity_subsidiary_id: z.string().optional(),
    announcementNumber: z.string().optional(),
    announcementDate: z.string(),
    announcementName: z.string(),
    description: z.string().optional(),
  })

  const {
    entityChanged,
    branchChanged,
    announcementType,
    offeredVacancies,
    verifiedScholarships,
    entity_id,
    entity_subsidiary_id,
    announcementNumber,
    announcementDate,
    announcementName,
    description
  } = registerBodySchema.parse(request.body)

  try {
    const user_id = request.user.sub

    const entityMatrix = await prisma.entity.findUnique({
        where: { user_id: user_id },
      })
      

    const entitySubsidiaryMatrix = entity_subsidiary_id
      ? await prisma.entitySubsidiary.findUnique({
        where: { id: entity_id },
      })
      : null

    if (!entityMatrix && !entitySubsidiaryMatrix) {
      throw new EntityNotExistsError()
    }

    if (!entitySubsidiaryMatrix) {
      const announcement = await prisma.announcement.create({
        data: {
          entityChanged,
          branchChanged,
          announcementType,
          offeredVacancies,
          verifiedScholarships,
          entity_id: entityMatrix!.id,
          announcementNumber,
          announcementDate: new Date(announcementDate),
          announcementName,
          description
        },
      })
      return reply.status(201).send({ announcement })
    }
    const announcement = await prisma.announcement.create({
      data: {
        entityChanged,
        branchChanged,
        announcementType,
        offeredVacancies,
        verifiedScholarships,
        entity_id: entityMatrix!.id,
        entity_subsidiary_id,
        announcementNumber,
        announcementDate: new Date(),
        announcementName,
        description
      },
    })
    return reply.status(201).send({ announcement })
  } catch (err: any) {
    if (err instanceof announcementAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
