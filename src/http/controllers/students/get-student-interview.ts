import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns-tz";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getStudentInterviews(request: FastifyRequest, response: FastifyReply) {
    try {
        const schema = z.object({
            candidate_id: z.string()
        })
        const { error, data } = schema.safeParse(request.params)
        if (error) {
            throw new APIError('Parâmetros incorretos')
        }
        const { candidate_id } = data
        const applicationWithInterviews = await prisma.candidate.findUnique({
            where: { id: candidate_id },
            select: {
                Application: {
                    select: {
                        candidateName: true,
                        InterviewSchedule: true,
                    }
                }
            }
        })
        return response.status(200).send({
            interviews: applicationWithInterviews?.Application.filter(e => !!e.InterviewSchedule.length).flatMap(e => {
                return e.InterviewSchedule.map(interview => (
                    {

                        id: interview.id,
                        date: interview.date,
                        hour: format(interview.date, 'HH:mm', { timeZone: 'America/Sao_Paulo' }),
                        interviewType: interview.interviewType,
                        candidateName: e.candidateName,
                        status: interview.InterviewRealized ? "Realizada" : interview.accepted ? "Aceito" : "Recusado",
                        interviewLink: interview.interviewLink,
                        InterviewComentary: interview.InterviewComentary,
                        InterviewNotRealizedReason: interview.InterviewNotRealizedReason,
                        InterviewNotRealizedComentary: interview.InterviewNotRealizedComentary,
                        finished: interview.InterviewRealized !== null,
                        cancelled: interview.accepted === false

                    }
                ))
            })
        })
    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}