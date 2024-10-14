import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { SCHOLARSHIP_GRANTED_STATUS } from "@/utils/enums/zod/scholarship-granted";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateScholarshipStatus(
    request: FastifyRequest,
    response: FastifyReply
) {
    const paramsSchema = z.object({
        scholarship_id: z.string()
    })
    const bodySchema = z.object({
        status: SCHOLARSHIP_GRANTED_STATUS
    })
    try {
        const { scholarship_id } = paramsSchema.parse(request.params)
        const { data, error } = bodySchema.safeParse(request.body)
        if (!!error) {
            throw new APIError('Status inválido')
        }
        const { status } = data
        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id },
            include: {
                application: {
                    include: {
                        EducationLevel: true
                    }
                }
            }
        })
        if (!scholarship) {
            throw new APIError('Bolsista não encontrado')
        }
        if (scholarship.status !== "SELECTED") {
            throw new APIError('Esta bolsa já teve seu status modificado e não pode ser alterado novamente')
        }
        await prisma.$transaction(async (tPrisma) => {

            if (status === 'REGISTERED') {
                // Verificar a existência do curso na entidade
                let entityCourse = await tPrisma.entityCourse.findFirst({
                    where: {
                        course_id: scholarship.application.EducationLevel.courseId,
                        OR: [{ entity_id: scholarship.application.EducationLevel.entityId }, { entitySubsidiary_id: scholarship.application.EducationLevel.entitySubsidiaryId }]
                    }
                })

                if (!entityCourse) {
                    entityCourse = await tPrisma.entityCourse.create({
                        data: {
                            course_id: scholarship.application.EducationLevel.courseId,
                            entity_id: scholarship.application.EducationLevel.entityId,
                            entitySubsidiary_id: scholarship.application.EducationLevel.entitySubsidiaryId
                        }
                    })
                }
                await tPrisma.student.create({
                    data: {
                        announcement_id: scholarship.application.announcement_id,
                        name: scholarship.application.candidateName,
                        admissionDate: new Date(),
                        scholarshipType: scholarship.application.EducationLevel.typeOfScholarship,
                        isPartial: scholarship.application.ScholarshipPartial!,
                        candidate_id: scholarship.application.candidate_id,
                        shift: scholarship.application.EducationLevel.shift,
                        semester: scholarship.application.EducationLevel.semester,
                        status: 'Active',
                        educationStyle: 'Presential',
                        entityCourse_id: entityCourse.id,


                    }
                })
            }

            await tPrisma.scholarshipGranted.update({
                where: { id: scholarship_id },
                data: {
                    status
                }
            })
        })
        return response.status(204).send()
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }

        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}