import { announcementAlreadyExists } from '@/errors/announcement-already-exists-error'
import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { prisma } from '@/lib/prisma'
import { AllScholarshipsType, Announcement, LevelType, SHIFT } from '@prisma/client'
import { fromZonedTime } from 'date-fns-tz'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import createAnnouncementEducationLevel from './utils/create-announcement-education-level'
import SelectEntityOrDirector from './utils/select-entity-or-director'

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
        curr.setHours(parseInt(hour), parseInt(min), 0, 0)
        return fromZonedTime(curr, 'America/Sao_Paulo')
      }),
      endHour: z.string().transform(v => {
        const [hour, min] = v.split(':')
        const curr = new Date()
        console.log(hour, min)
        curr.setUTCHours(parseInt(hour), parseInt(min), 0, 0)
        return fromZonedTime(curr, 'America/Sao_Paulo')
      }),
      interval: z.number().int().default(5)
    }).nullish(),
    hasInterview: z.boolean(),
    announcementNumber: z.string().optional(),
    openDate: z.string().pipe(z.coerce.date()),
    closeDate: z.string().transform(v => {
      const d = new Date(`${v}T23:59:59`)
      return d
    }),
    announcementDate: z.string().transform(v => {
      const d = new Date(`${v}T23:59:59`)
      return d
    }),
    announcementBegin: z.string(),
    announcementName: z.string(),
    description: z.string().optional(),
    types1: z.array(scholarshipGrantedType).optional(),
    type2: z.string().optional(),
    criteria: z.array(z.enum(["CadUnico", "LeastFamilyIncome", "SeriousIllness", "Draw", "Distance"])),
    waitingList: z.boolean(),
    educationalLevels: z.array(z.object({
      name: z.string(),
      id: z.number().nullish(),
      type: z.string(),
      typeOfScholarship: z.string(),
      level: z.string(),
      verifiedScholarships: z.number(),
      shift: z.string(),
      semester: z.number().nullish(),
      entity_subsidiary_id: z.string().nullish(),
    }))
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
    criteria,
    educationalLevels
  } = registerBodySchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const role = request.user.role
    const entityMatrix = await SelectEntityOrDirector(user_id, role, { includeUser: false })
    let subsidiaries = 0

    if (!entityMatrix) {
      throw new EntityNotExistsError()
    }
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
    let announcement: Announcement;
    await prisma.$transaction(async (tprisma) => {

      if (!subsidiaries) {


        announcement = await tprisma.announcement.create({
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
            entity_id: entityMatrix.id,
            announcementNumber: `${countAnnouncement + 1}/${openDate.getFullYear()}`,
            announcementDate: announcementDate,
            announcementBegin: new Date(announcementBegin),
            announcementName,
            description,
            types1,
            type2
          },
        })
      } else {



        announcement = await tprisma.announcement.create({
          data: {
            entityChanged,
            branchChanged,
            openDate,
            closeDate,
            announcementType,
            offeredVacancies,
            verifiedScholarships,
            waitingList,
            entity_id: entityMatrix.id,
            entity_subsidiary: {
              connect: entity_subsidiary_id?.map(id => ({ id })),
            },
            criteria,
            announcementNumber: `${countAnnouncement + 1}/${openDate.getFullYear()}`,
            announcementDate: announcementDate,
            announcementBegin: new Date(announcementBegin),
            announcementName,
            description,
            types1,
            type2
          },
        })
      }
      await Promise.all(educationalLevels.map(async (education) => {
        const { entity_subsidiary_id, ...data } = education
        await createAnnouncementEducationLevel({
          dbClient: tprisma,
          data: {
            entityId: !!education.entity_subsidiary_id ? null : entityMatrix.id,
            courseId: data.id ?? null,
            typeOfScholarship: data.typeOfScholarship as AllScholarshipsType,
            level: data.level as LevelType,
            verifiedScholarships: data.verifiedScholarships,
            semester: data.semester ?? null,
            shift: data.shift as SHIFT,
            type1Benefit: announcement.types1,
            announcementId: announcement.id,
            courseName: data.name,
            courseType: data.type,
            entitySubsidiaryId: education.entity_subsidiary_id ?? null
          }
        })
      }))

      if (hasInterview && announcementInterview) {
        await tprisma.announcementInterview.create({ data: { ...announcementInterview, announcement_id: announcement!.id } })
      }
      return reply.status(201).send({ announcement: announcement })
    })



  } catch (err: any) {
    if (err instanceof announcementAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
