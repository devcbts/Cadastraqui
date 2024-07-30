import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidateInterviews(request: FastifyRequest, reply: FastifyReply) {
    const params = z.object({
        interview_id: z.string().optional()
    })
    const { interview_id } = params.parse(request.params)
    try {
        const user_id = request.user.sub
        const candidateOrResponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
        }


        if (interview_id) {
            const interview = await prisma.interviewSchedule.findUnique({
                where: { id: interview_id },
                include: { application: true }
            })
            if (!interview) {
                throw new Error("Entrevista não encontrada")
            }
            if (!interview.application || (interview.application.candidate_id !== candidateOrResponsible.UserData.id && interview.application.responsible_id !== candidateOrResponsible.UserData.id)) {
                throw new Error("Candidato não vinculado a essa entrevista")

            }
            const interviewInfo = {
                id: interview.id,
                date: interview.date,
                hour: `${interview.date.getHours()} : ${interview.date.getMinutes().toString().padStart(2, '0')}`,
                interviewType: interview.interviewType,
                candidateName: interview.application.candidateName,
                status: interview.InterviewRealized ? "Realizada" : interview.accepted ? "Aceito" : "Recusado",
                interviewLink: interview.interviewLink,
                InterviewComentary: interview.InterviewComentary,
                InterviewNotRealizedReason: interview.InterviewNotRealizedReason,
                InterviewNotRealizedComentary: interview.InterviewNotRealizedComentary,
                finished: interview.InterviewRealized !== null,
                cancelled: interview.accepted === false
            }

            return reply.status(200).send({ interview: interviewInfo })
        }
        const idField = candidateOrResponsible.IsResponsible ? { responsible_id: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
        // get current interviews for all candidates (if responsible) or candidate
        const interviews = await prisma.interviewSchedule.findMany({
            where: { application: idField },
            include: { application: { include: { candidate: true } }, assistantSchedule: true }
        })
        const mappedData = interviews.map((schedule) => {
            const duration = schedule.assistantSchedule?.duration
            const endDate = new Date(schedule.date)
            endDate.setMinutes(endDate.getMinutes() + duration!)
            return {
                id: schedule.id,
                date: schedule.date,
                endDate,
                hour: `${schedule.date.getHours()}:${schedule.date.getMinutes().toString().padStart(2, '0')}`,
                interviewType: schedule.interviewType === "Interview" ? "Entrevista" : "Visita Domiciliar",
                status: schedule.InterviewRealized ? "Realizada" : schedule.accepted ? "Aceito" : "Recusado",
                candidateName: schedule.application?.candidate.name // Inclui o nome do candidato
            };
        })
        // const applications = await prisma.application.findMany({
        //     where: idField,
        //     include: { InterviewSchedule: true },

        // })


        // // Encontrar entrevistas
        // const interviews = applications.map(application => ({
        //     interviewSchedule: application.InterviewSchedule,
        //     candidateName: application.candidateName
        // }));
        // console.log(interviews)
        // const scheduleGrouped: any = {};

        // const interviewFormatted = interviews.map(interview => {
        //     const interviewsApplication = interview.interviewSchedule
        //         .filter(schedule => schedule.date.getTime() > new Date().getTime() - 30 * 24 * 3600 * 1000)
        //         .map(schedule => {
        //             return {
        //                 id: schedule.id,
        //                 date: schedule.date,
        //                 hour: `${schedule.date.getHours()} : ${schedule.date.getMinutes().toString().padStart(2, '0')}`,
        //                 interviewType: schedule.interviewType === "Interview" ? "Entrevista" : "Visita Domiciliar",
        //                 status: schedule.InterviewRealized ? "Realizada" : schedule.accepted ? "Aceito" : "Recusado",
        //                 candidateName: interview.candidateName // Inclui o nome do candidato
        //             };
        //         });

        //     interviewsApplication.forEach(interview => {
        //         const dateDayandMonthAndYear = interview.date.toISOString().split('T')?.[0];
        //         if (!scheduleGrouped[dateDayandMonthAndYear]) {
        //             scheduleGrouped[dateDayandMonthAndYear] = [];
        //         }
        //         scheduleGrouped[dateDayandMonthAndYear].push(interview);
        //     });

        //     return scheduleGrouped;
        // });

        return reply.status(200).send({ interviews: mappedData })
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