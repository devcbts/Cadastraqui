import { ScholarshipNotFoundError } from "@/errors/scholarship-not-found-error";
import { prisma } from "@/lib/prisma";
import callNextCandidate from "@/utils/administrative Functions/call-next-candidate";
import { SCHOLARSHIP_GRANTED_STATUS } from "@/utils/enums/zod/scholarship-granted";
import { SolicitationType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateScholarshipGranted(request: FastifyRequest, reply: FastifyReply) {
    const requestParamsSchema = z.object({
        scholarship_id: z.string(),
    })
    const scholarshipBodySchema = z.object({
        type1TermAccepted: z.boolean(),
        type1DocumentReceived: z.boolean(),
        type2TermAccepted: z.boolean(),
        type2DocumentReceived: z.boolean(),
        ScholarshipCode: z.string(),
        status: SCHOLARSHIP_GRANTED_STATUS
    }).partial()

    const { scholarship_id } = requestParamsSchema.parse(request.params)
    const { type1TermAccepted, type1DocumentReceived, type2TermAccepted, type2DocumentReceived, status, ScholarshipCode } = scholarshipBodySchema.parse(request.body)
    try {
        const user_id: string = request.user.sub;
        const scholarship = await prisma.scholarshipGranted.findUnique({
            where: { id: scholarship_id, application: { SocialAssistant: { user_id: user_id } } },
            include: {
                application: {
                    select: { educationLevel_id: true }
                }
            }
        })
        if (!scholarship) {
            throw new ScholarshipNotFoundError();

        }
        let newScholarshipInfo;
        await prisma.$transaction(async (tPrisma) => {

            newScholarshipInfo = await tPrisma.scholarshipGranted.update({
                where: { id: scholarship_id },
                data: {
                    type1TermAccepted,
                    type1DocumentReceived,
                    type2TermAccepted,
                    type2DocumentReceived,
                    ScholarshipCode,
                    status
                }
            })
            if (type1TermAccepted || type2TermAccepted) {
                const type = type1TermAccepted ? SolicitationType.BenefitOne : SolicitationType.BenefitTwo
                const hasTermRequest = await tPrisma.requests.findFirst({
                    where: {
                        AND: [{ application_id: scholarship.application_id }, { type }]
                    }
                })
                if (!hasTermRequest) {
                    const desc = type1TermAccepted ? 'Termo de benefícios Tipo I' : 'Termo de benefícios Tipo II'
                    await tPrisma.requests.create({
                        data: {
                            application_id: scholarship.application_id,
                            description: desc,
                            type
                        }
                    })
                    await tPrisma.applicationHistory.create({
                        data: {
                            createdBy: "Assistant",
                            application_id: scholarship.application_id,
                            description: `Gerado o termo de benefícios para assinatura (TIPO ${type1TermAccepted ? 'I' : 'II'})`
                        }
                    })
                }
            }
            if (status === "GAVEUP") {

                //Update Student application

                await tPrisma.application.update({
                    where: { id: scholarship.application_id },
                    data: {
                        status: "Rejected",
                        applicationHistories: {
                            create: {
                                description: "Inscrição Atualizada: Você desistiu da matrícula, portanto sua inscrição foi indeferida nesse processo seletivo"
                            }
                        }
                    }
                })
                // Call Next Candidate in WaitingList
                await callNextCandidate(scholarship.application.educationLevel_id, tPrisma)



            }

        })

        return reply.status(201).send({ scholarship: newScholarshipInfo })

    } catch (error) {
        if (error instanceof ScholarshipNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: 'Internal server error', error })

    }
}