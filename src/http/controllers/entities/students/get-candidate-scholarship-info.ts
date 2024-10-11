import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { historyDatabase, prisma } from "@/lib/prisma"
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export default async function getScholarshipsByLevel(request: FastifyRequest, reply: FastifyReply) {
    const requestParamsSchema = z.object({
        application_id: z.string(),
    })

    const { application_id } = requestParamsSchema.parse(request.params)
    try {
        
        const application = await prisma.application.findUnique({
            where: {
                id: application_id
            },
            include: {
                candidate: true,
                EducationLevel: {
                    include: {
                        course: true,
                        entitySubsidiary: true,
                        entity: true
                    }
                }
            }
        })

        if (!application) {
            throw new ResourceNotFoundError()
        }

        // Application and Scholarship Info
        const entity = application.EducationLevel.entity || application.EducationLevel.entitySubsidiary
        const course = application.EducationLevel.course

        const scholarshipInfo = {
            entityName: entity?.socialReason,
            courseName: course.name,
            courseType: course.Type,
            semester : application.EducationLevel.semester,
            isPartial: application.ScholarshipPartial // Indica se a bolsa é 50% ou 100%


        }
        // Personal Info
        const IsResponsible = application.responsible_id ? true : false
        const identityDetails = await historyDatabase.identityDetails.findUnique({
            where: { application_id }
        })

        if (!identityDetails) {
            throw new ResourceNotFoundError()
        }

        let personalInfo
        if (IsResponsible) {
            const member = await historyDatabase.familyMember.findFirst({
                where: { application_id, CPF: application.candidate.CPF }
            })
            if (!member) {
                throw new ResourceNotFoundError()
            }

            personalInfo = {
                name: member.fullName,
                socialName: member.socialName,
                CPF: member.CPF,
                birthDate: member.birthDate,
                RG: member.RG,
                gender: member.gender,
                phone: member.workPhone || identityDetails.workPhone,
                email: member.email || identityDetails.email,
                address: `${identityDetails.address}, ${identityDetails.addressNumber} - ${identityDetails.neighborhood}, ${identityDetails.city} - ${identityDetails.UF}`,

                
            }
        }
        else{
            personalInfo = {
                name: identityDetails.fullName,
                socialName: identityDetails.socialName,
                CPF: identityDetails.CPF,
                birthDate: identityDetails.birthDate,
                RG: identityDetails.RG,
                gender : identityDetails.gender,
                phone : identityDetails.workPhone,
                email : identityDetails.email,
                address: `${identityDetails.address}, ${identityDetails.addressNumber} - ${identityDetails.neighborhood}, ${identityDetails.city} - ${identityDetails.UF}`,


            }
        }

        
        return reply.status(200).send({ scholarshipInfo, personalInfo })


    }
    catch (error) {

        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: 'Resource not found' })
        }
        return reply.status(500).send({ message: 'Internal server error', error })
    }
}
