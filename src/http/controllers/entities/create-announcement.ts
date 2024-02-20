import { announcementAlreadyExists } from '@/errors/announcement-already-exists-error'
import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateAnnoucment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const scholarshipGrantedType = z.enum(['UNIFORM', 'TRANSPORT', 'FOOD', 'HOUSING', 'STUDY_MATERIAL'])

  const registerBodySchema = z.object({
    entityChanged: z.boolean(),
    branchChanged: z.boolean(),
    announcementType: z.enum(['ScholarshipGrant', 'PeriodicVerification']),
    offeredVacancies: z.number(),
    verifiedScholarships: z.number(),
    entity_id: z.string().optional(),
    entity_subsidiary_id: z.array(z.string()).optional(),
    announcementNumber: z.string().optional(),
    announcementDate: z.string(),
    announcementBegin: z.string(),
    announcementName: z.string(),
    description: z.string().optional(),
    types1: z.array(scholarshipGrantedType).optional(),
    type2: z.string().optional(),
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
    announcementBegin,
    announcementName,
    description,
    types1,
    type2
  } = registerBodySchema.parse(request.body)

  try {
    const user_id = request.user.sub

    const entityMatrix = await prisma.entity.findUnique({
      where: { user_id: user_id },
    })

    let subsidiaries
    if (entity_subsidiary_id && entity_subsidiary_id.length > 0) {
      // Supondo que você queira verificar a existência de cada subsidiária
      subsidiaries = await prisma.entitySubsidiary.findMany({
        where: {
          id: { in: entity_subsidiary_id },
        },
      });

      // Se a quantidade de subsidiárias encontradas não corresponder à quantidade de IDs fornecidos
      if (subsidiaries.length !== entity_subsidiary_id.length) {
        throw new Error("Uma ou mais subsidiárias fornecidas não existem.");
      }

      if (!entityMatrix) {
        throw new EntityNotExistsError()
      }

      if (!subsidiaries) {
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
            announcementBegin: new Date(announcementBegin),
            announcementName,
            description,
            types1,
            type2
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
          entity_subsidiary: {
            connect: entity_subsidiary_id.map(id => ({ id })),
          },
          announcementNumber,
          announcementDate: new Date(announcementDate),
          announcementBegin: new Date(announcementBegin),
          announcementName,
          description,
          types1,
          type2
        },
      })
      return reply.status(201).send({ announcement })
    }
  } catch (err: any) {
    if (err instanceof announcementAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
