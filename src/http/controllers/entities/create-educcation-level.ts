import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error';
import { NotAllowedError } from '@/errors/not-allowed-error';
import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { EntityNotExistsError } from '../../../errors/entity-not-exists-error';

export async function createEducationalLevel(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    console.log(request.params)
    const SHIFT = z.enum(["Matutino",
        "Vespertino",
        "Noturno",
        "Integral"])
    const educationalLevelBodySchema = z.object({
        level: z.enum(['BasicEducation', 'HigherEducation']),
        basicEduType: z.union([
            z.literal('Preschool'),
            z.literal('Elementary'),
            z.literal('HighSchool'),
            z.literal('ProfessionalEducation'),
            z.literal('')
        ]).optional(),
        scholarshipType: z.union([
            z.literal('Law187Scholarship'),
            z.literal('Law187ScholarshipPartial'),
            z.literal('StudentWithDisabilityPartial'),
            z.literal('StudentWithDisability'),
            z.literal('FullTime'),
            z.literal('FullTimePartial'),
            z.literal('EntityWorkersPartial'),
            z.literal('EntityWorkers'),
            z.literal('')
        ]).optional(),
        higherEduScholarshipType: z.union([
            z.literal('PROUNIFull'),
            z.literal('PROUNIPartial'),
            z.literal('StateGovernment'),
            z.literal('CityGovernment'),
            z.literal('ExternalEntities'),
            z.literal('HigherEduInstitutionFull'),
            z.literal('HigherEduInstitutionPartial'),
            z.literal('HigherEduInstitutionWorkers'),
            z.literal('PostgraduateStrictoSensu'),
            z.literal('')

            // ... add other enum values here
        ]).optional(),
        offeredCourseType: z.union([
            z.literal('UndergraduateBachelor'),
            z.literal('UndergraduateLicense'),
            z.literal('UndergraduateTechnologist'),
            z.literal('')
        ]).optional(),
        availableCourses: z.string().optional(),
        offeredVacancies: z.number().optional(),
        verifiedScholarships: z.number().optional(),
        shift: SHIFT,
        grade: z.string().optional().nullable(),
        semester: z.number().optional(),
        entity_subsidiary_id: z.string().nullish(),
    })

    const educationLevelParamsSchema = z.object({
        announcement_id: z.string(),
    })

    const {
        level,
        basicEduType,
        scholarshipType,
        higherEduScholarshipType,
        offeredCourseType,
        availableCourses,
        offeredVacancies,
        verifiedScholarships,
        shift,
        grade,
        semester,
        entity_subsidiary_id
    } = educationalLevelBodySchema.parse(request.body)

    const { announcement_id } = educationLevelParamsSchema.parse(request.params)

    try {

        const user_id = request.user.sub

        const entity = await prisma.entity.findUnique({
            where: { user_id: user_id }
        })

        if (!entity) {
            throw new EntityNotExistsError()
        }

        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id }
        })
        const entitySubsidiary = await prisma.entitySubsidiary.findUnique({
            where: { id: entity_subsidiary_id ?? '' }
        })

        if (!announcement) {
            throw new AnnouncementNotExists()
        }

        if (announcement.entity_id !== entity.id) {
            throw new NotAllowedError()
        }

        const educationLevelData = {
            level,
            shift,
            announcementId: announcement_id,
            // Add other fields conditionally
            ...(basicEduType && { basicEduType }),
            ...(scholarshipType && { scholarshipType }),
            ...(higherEduScholarshipType && { higherEduScholarshipType }),
            ...(offeredCourseType && { offeredCourseType }),
            ...(availableCourses && { availableCourses }),
            ...(offeredVacancies && { offeredVacancies }),
            ...(verifiedScholarships && { verifiedScholarships }),
            ...(semester && { semester }),
            ...(grade && { grade }),

            ...(entitySubsidiary && { entitySubsidiaryId: entity_subsidiary_id })
        };

        await prisma.educationLevel.create({
            data: educationLevelData

        })
        return reply.status(201).send({ message: 'Educational level created successfully!' })
    } catch (err: any) {
        if (err instanceof EntityNotExistsError) {
            return reply.status(404).send({ message: err.message })
        }

        if (err instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: err.message })
        }

        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }
        return reply.status(500).send({ message: err.message })
    }
}
