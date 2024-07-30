import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidateInterviews(request: FastifyRequest, reply: FastifyReply) {
    const params = z.object({
        candidate_id: z.string().optional(),
        interview_id: z.string().optional()
    })
    const { candidate_id, interview_id } = params.parse(request.params)
    console.log(candidate_id, interview_id)
    try {
        const user_id = request.user.sub
        const candidateOrResponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
        }
        const candidateID = candidateOrResponsible.IsResponsible ? candidate_id : candidateOrResponsible.UserData.id
        if (!candidateID) {
            throw new ResourceNotFoundError()
        }

        if (interview_id) {
            const interview = await prisma.interviewSchedule.findUnique({
                where: { id: interview_id },
                include: { application: true }
            })
            if (!interview) {
                throw new Error("Entrevista não encontrada")
            }
            if (!interview.application || interview.application.candidate_id !== candidateID) {
                throw new Error("Candidato não vinculado a essa entrevista")

            }
            const interviewInfo = {
                id: interview.id,
                date: interview.date,
                hour: `${interview.date.getHours()} : ${interview.date.getMinutes().toString().padStart(2, '0')}`,
                interviewType: interview.interviewType === "Interview" ? "Entrevista" : "Visita Domiciliar",
                status: interview.InterviewRealized ? "Realizada" : interview.accepted ? "Aceito" : "Recusado",
                interviewLink: interview.interviewLink,
                InterviewComentary: interview.InterviewComentary,
                InterviewNotRealizedReason: interview.InterviewNotRealizedReason,
                InterviewNotRealizedComentary: interview.InterviewNotRealizedComentary,
            }

            return reply.status(200).send({ interview: interviewInfo })
        }
        const applications = await prisma.application.findMany({
            where: { candidate_id: candidateID },
            include: { InterviewSchedule: true },

        })


        // Encontrar entrevistas
        const interviews = applications
            .map(application => application.InterviewSchedule);

        const scheduleGrouped: any = {};

        const interviewFormatted = interviews.map(interview => {
            const interviewsApplication = interview
                .filter(interview => interview.date.getTime() > new Date().getTime() - 30 * 24 * 3600 * 1000)
                .map(interview => {
                    return {
                        id: interview.id,
                        date: interview.date,
                        hour: `${interview.date.getHours()} : ${interview.date.getMinutes().toString().padStart(2, '0')}`,
                        interviewType: interview.interviewType === "Interview" ? "Entrevista" : "Visita Domiciliar",
                        status: interview.InterviewRealized ? "Realizada" : interview.accepted ? "Aceito" : "Recusado",
                    };
                });

            interviewsApplication.forEach(interview => {
                const dateDayandMonthAndYear = `${interview.date.getDate()}/${interview.date.getMonth() + 1}/${interview.date.getFullYear()}`;
                if (!scheduleGrouped[dateDayandMonthAndYear]) {
                    scheduleGrouped[dateDayandMonthAndYear] = [];
                }
                scheduleGrouped[dateDayandMonthAndYear].push(interview);
            });

            return { ...interviewsApplication };
        });

        return reply.status(200).send({ interviews: interviewFormatted })
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: "Candidato não encontrado" })
        }
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: "Internal Server Error", error })
    }
}