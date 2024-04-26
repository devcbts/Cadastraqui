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
    announcementInterview: z.object({
      startDate: z.string().pipe(z.coerce.date()),
      endDate: z.string().pipe(z.coerce.date()),
      duration: z.number().int().default(20),
      beginHour: z.string().transform(v => {
        const [hour, min] = v.split(':')
        const curr = new Date()
        curr.setUTCHours(parseInt(hour), parseInt(min), 0)
        return curr
      }),
      endHour: z.string().transform(v => {
        const [hour, min] = v.split(':')
        const curr = new Date()
        console.log(hour, min)
        curr.setUTCHours(parseInt(hour), parseInt(min), 0)
        return curr
      }),
      interval: z.number().int().default(5)
    }).optional(),
    hasInterview: z.boolean(),
    announcementNumber: z.string().optional(),
    openDate: z.string().pipe(z.coerce.date()),
    closeDate: z.string().pipe(z.coerce.date()),
    announcementDate: z.string(),
    announcementBegin: z.string(),
    announcementName: z.string(),
    description: z.string().optional(),
    types1: z.array(scholarshipGrantedType).optional(),
    type2: z.string().optional(),
    criteria: z.array(z.enum(["CadUnico", "LeastFamilyIncome", "SeriousIllness", "Draw"])),
    waitingList: z.boolean()
  })

  const {
    entityChanged,
    branchChanged,
    announcementType,
    offeredVacancies,
    verifiedScholarships,
    entity_id,
    hasInterview,
    waitingList,
    openDate,
    closeDate,
    announcementInterview,
    entity_subsidiary_id,
    announcementDate,
    announcementBegin,
    announcementName,
    description,
    types1,
    type2,
    criteria
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
      console.log('aqui agora')
      // get current announcement linked to an entity at some year
      const currentYear = openDate.getFullYear()
      const countAnnouncement = await prisma.announcement.count({
        where: {
          AND: [
            { entity_id: entityMatrix.id },
            { openDate: { gte: new Date(`${currentYear}-01-01`), lt: new Date(`${currentYear + 1}-01-01`) } }
          ]
        }
      })
      if (!subsidiaries) {


        const announcement = await prisma.announcement.create({
          data: {
            entityChanged,
            branchChanged,
            announcementType,
            openDate,
            closeDate,
            offeredVacancies,
            verifiedScholarships,
            waitingList,
            criteria,
            entity_id: entityMatrix!.id,
            announcementNumber: `${countAnnouncement + 1}/${openDate.getFullYear()}`,
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
          openDate,
          closeDate,
          announcementType,
          offeredVacancies,
          verifiedScholarships,
          waitingList,
          entity_id: entityMatrix!.id,
          entity_subsidiary: {
            connect: entity_subsidiary_id?.map(id => ({ id })),
          },
          criteria,
          announcementNumber: `${countAnnouncement + 1}/${openDate.getFullYear()}`,
          announcementDate: new Date(announcementDate),
          announcementBegin: new Date(announcementBegin),
          announcementName,
          description,
          types1,
          type2
        },
      })
      if (hasInterview && announcementInterview) {
        await prisma.announcementInterview.create({ data: { ...announcementInterview, announcement_id: announcement.id } })
      }
      return reply.status(201).send({ announcement })
    }
  } catch (err: any) {
    if (err instanceof announcementAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
