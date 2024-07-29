import { AnnouncementNotExists } from "@/errors/announcement-not-exists-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";




export default async function createInterviewSolicitation(request: FastifyRequest,
    reply: FastifyReply
) {
    const InterviewType = z.enum(["Interview", "Visit"])
    const params = z.object({
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
       
       const ocupiedSchedules = await prisma.interviewSchedule.findMany({
        where: {application_id, OR: [{AND :[{accepted: true}, {date: {gte: new Date()}}]}, {InterviewRealized: true}]},
       })
       if (ocupiedSchedules.length > 0) {
           throw new Error('Candidato já possui uma entrevista marcada ou já realizou entrevista nesse edital')
        
       }
        const interviewSchedule = await prisma.interviewSchedule.update({
            where: { id: schedule_id },
            data: {
                application_id,
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