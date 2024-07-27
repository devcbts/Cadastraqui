import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidateInterviewSchedule(
    request: FastifyRequest,
    response: FastifyReply
) {
    const params = z.object({
        application_id: z.string()
    })

    try {
        const { application_id } = params.parse(request.params)
        const application = await prisma.application.findUnique({
            where: { id: application_id },
            include: {
                SocialAssistant: true,
                announcement: {
                    include: {
                        interview: true, AssistantSchedule: {
                            where: {
                                endDate: {
                                    gte: new Date()
                                }
                            }
                        }
                    }
                },
            }
        })
        if (!application || !application.announcement.interview) {
            if (!application) {
                throw new Error("Inscrição não encontrada ou assistente não vinculado(a)")
            }
            throw new Error("Este edital não permite entrevistas")
        }
        const assistantSchedule = application.announcement.AssistantSchedule

        if (!assistantSchedule) {
            throw new Error("Não há horários disponíveis para esse assistente")
        }

        const availabeSchedules = await prisma.interviewSchedule.findMany({
            where: {
                AND: [
                    { assistant_id: application.SocialAssistant?.id },
                    { announcement_id: application.announcement.id },
                    {
                        date: {
                            gte: new Date()

                        }
                    },
                    {
                        application_id: null
                    }]
            },
            orderBy: { date: 'asc' }
        })



        return response.status(200).send(availabeSchedules)
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}