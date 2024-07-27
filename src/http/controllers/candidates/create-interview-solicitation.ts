import { AnnouncementNotExists } from "@/errors/announcement-not-exists-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";




export default async function createInterviewSolicitation(request: FastifyRequest,
    reply: FastifyReply
) {
    const InterviewType = z.enum(["Interview", "Visit"])
    const params = z.object({
        // announcement_id: z.string(),
        schedule_id: z.string(),
    })

    const createInterviewSolicitationBody = z.object({
        application_id: z.string(),
        date: z.string().nullish(),
        interviewType: InterviewType

    })

    const { schedule_id } = params.parse(request.params)
    const { application_id, interviewType } = createInterviewSolicitationBody.parse(request.body)
    try {
        const schedule = await prisma.interviewSchedule.findUnique({
            where: { id: schedule_id }

        })
        if (schedule?.application_id) {
            throw new Error('Este horário já foi ocupado.')
        }
        // const assistantSchedule = await prisma.assistantSchedule.findFirst({
        //     where: {
        //         AND: [{ announcement_id }, { assistant_id }, {
        //             endDate: {
        //                 gte: new Date()
        //             }
        //         }]
        //     }

        // })
        // if (!assistantSchedule) {
        //     throw new Error("Não há horários disponíveis para esse assistente")

        // }
        // const application = await prisma.application.findUnique({
        //     where: { id: application_id }
        // })

        // if (!application) {
        //     throw new Error("Inscrição não existente")

        // }
        // const announcement = await prisma.announcement.findUnique({
        //     where: { id: announcement_id }

        // })
        // if (!announcement) {
        //     throw new AnnouncementNotExists()

        // }

        // if (new Date(date) < assistantSchedule.startDate || new Date(date) > assistantSchedule.endDate) {
        //     throw new Error("Data fora do período permitido")

        // }

        // const ocupiedSchedule = await prisma.interviewSchedule.findFirst({
        //     where: { announcement_id, assistant_id, application_id, date }
        // })
        // if (ocupiedSchedule) {
        //     throw new Error("Horário já ocupado")
        // }
        const interviewSchedule = await prisma.interviewSchedule.update({
            where: { id: schedule_id },
            data: {
                // date: new Date(date),
                // assistant_id,
                application_id,
                // announcement_id,
                interviewType
            }
        })

        return reply.status(201).send(interviewSchedule)
    } catch (error: any) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message })
        }
        if (error instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: error })
    }
}