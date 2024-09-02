import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getBenefitsInformation(
    request: FastifyRequest,
    response: FastifyReply
) {
    const paramsSchema = z.object({
        application_id: z.string(),
        // educationLevel_id: z.string()
    })
    const querySchema = z.object({
        type: z.union([z.literal('tipo1'), z.literal('tipo2')])
    })
    try {

        // const filter =  querySchema.parse(request.query)
        // if(!filter){
        //     throw new APIError('Necessário informar o tipo de benefício')
        // }
        const {
            application_id
        } = paramsSchema.parse(request.params)

        const application = await prisma.application.findUnique({
            where: { id: application_id },
            include: {
                candidate: {
                    include: {
                        IdentityDetails: true,
                        FamillyMember: true
                    }
                },
                responsible: {
                    include: {
                        IdentityDetails: true,
                        FamillyMember: true
                    }
                },
                EducationLevel: {
                    include: {
                        entitySubsidiary: true,
                    }
                },
                announcement: {
                    include: { entity: true }
                },
                ScholarshipGranted: {
                    include: {
                        type2Benefits: true
                    }
                },

            }
        })
        const hasResponsible = !!application?.responsible
        // return based on 'hasResponsible' being true or false
        if (hasResponsible) {
            const legalDependantIdentity = application.responsible?.FamillyMember.find(e => application.candidate.CPF === e.CPF)

            return response.status(200).send({ ...application, entity: application?.announcement.entity, candidateIdentity: legalDependantIdentity, hasResponsible, family: application.responsible?.FamillyMember.filter(e => application.candidate.CPF !== e.CPF) })
        } else {
            return response.status(200).send({ ...application, entity: application?.announcement.entity, hasResponsible, family: application?.candidate.FamillyMember })
        }

    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}