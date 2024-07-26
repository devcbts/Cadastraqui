import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidateInterviewSchedule(
    request: FastifyRequest,
    response: FastifyReply
) {
    const params = z.object({
        announcement_id: z.string(),
        assistant_id: z.string()
    })

    try {
        const { announcement_id, assistant_id } = params.parse(request.params)
        const announcement = await prisma.announcement.findFirst({
            where: { AND: [{ id: announcement_id }, { socialAssistant: { some: { id: assistant_id } } }] },
            include: {
                interview: true,
            }
        })
        if (!announcement || !announcement.interview) {
            if (!announcement) {
                throw new Error("Edital não encontrado ou assistente não vinculado(a)")
            }
            throw new Error("Este edital não permite entrevistas")
        }
        const assistantSchedule = await prisma.assistantSchedule.findFirst({
            where: {
                AND: [{ announcement_id }, { assistant_id }, {
                    endDate: {

                        gte: new Date()
                    }
                }]
            }
        })

        if (!assistantSchedule) {
            throw new Error("Não há horários disponíveis para esse assistente")
        }
       
        const availabeSchedules = await prisma.interviewSchedule.findMany({
            where: {
                assistant_id,
                announcement_id,
                date: {
                    gte: new Date()

                },
                application_id: null
            }
        })


       

        return response.status(200).send(availabeSchedules)
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}