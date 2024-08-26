import { EducationLevelNotFoundError } from "@/errors/education-level-not-found-error";
import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getQuantitativeInfo(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestParamsSchema = z.object({
        educationLevel_id: z.string(),
    })

    const { educationLevel_id } = requestParamsSchema.parse(request.params)
    try {

        const user_id = request.user.sub;

        const isAssistant = await prisma.socialAssistant.findUnique({
            where: {
                user_id
            }
        })
        if (!isAssistant) {
            throw new ForbiddenError();
        }

        const educationLevel = await prisma.educationLevel.findUnique({
            where: {
                id: educationLevel_id,
                announcement: {
                    socialAssistant: { some: { id: isAssistant.id } }
                }
            },
            select: {
                verifiedScholarships: true,
                Application: {
                        include: {
                            requests: true,
                            InterviewSchedule: true
                        }
                },
            

            },
            
        })

        if (!educationLevel) {
            throw new EducationLevelNotFoundError();
        }

        const totalApplications = educationLevel.Application.length;
        const inAnalysis = educationLevel.Application.filter((application) => application.status !== 'Pending' ).length;
        
        

        const candidatesWithPendingDocuments = educationLevel.Application.filter((application) => {
            return application.requests.some((request) => request.type === 'Document' && request.answered );
        }).length;

        const candidatesAwaitingInterview = educationLevel.Application.filter((application) => {
            return application.InterviewSchedule.some((interview) => interview.InterviewRealized === true); ;
        })

    } catch (error : any) {
        if (error instanceof ForbiddenError) {
            return reply.code(403).send({ error: error.message });
            
        }
        if (error instanceof EducationLevelNotFoundError) {
            return reply.code(404).send({ error: error.message });
            
        }
        return reply.code(500).send({ error: error.message });
    }

}