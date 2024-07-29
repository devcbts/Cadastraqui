import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export default async function getAnnouncementSchedule(request: FastifyRequest, reply: FastifyReply) {
    const requestParams = z.object({
        announcement_id: z.string(),
        schedule_id: z.string().optional()
    })
    const { announcement_id, schedule_id } = requestParams.parse(request.params)
    try {
        const user_id = request.user.sub
        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id }
        })
        if (!assistant) {
            throw new ForbiddenError()
        }
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id, socialAssistant: { some: { id: assistant.id } } },
            include: { interview: true }
        })

        if (!announcement) {
            throw new ResourceNotFoundError()
        }
        if (!announcement.interview) {
            throw new Error("Este edital não permite entrevistas")
        }
        if (schedule_id) {
            const schedule = await prisma.interviewSchedule.findUnique({
                where: { id: schedule_id, assistant_id: assistant.id, announcement_id: announcement_id },
                include: { application: true }
            })
            if (!schedule) {
                throw new ResourceNotFoundError()
            }
            const scheduleInfo = {
                id: schedule.id,
                date: schedule.date,
                hour: `${schedule.date.getUTCHours()} : ${schedule.date.getUTCMinutes().toString().padStart(2, '0')}`,
                candidateName: schedule.application?.candidateName,
                applicationNumber: schedule.application?.number,
                interviewType: schedule.interviewType,
                interviewLink: schedule.interviewLink,
                InterviewComentary: schedule.InterviewComentary,
                InterviewNotRealizedReason: schedule.InterviewNotRealizedReason,
                InterviewNotRealizedComentary: schedule.InterviewNotRealizedComentary,
            }
            return reply.status(200).send({ schedule: scheduleInfo })
        }

        const schedules = await prisma.interviewSchedule.findMany({
            where: { announcement_id: announcement_id, assistant_id: assistant.id, application_id: { not: null } },
            include: { application: true }
        })

        const scheduleGrouped: any = {};
        schedules.map((schedule) => {
            // const dateDayandMonthAndYear = `${schedule.date.getUTCDay()}/${schedule.date.getUTCMonth()}/${schedule.date.getUTCFullYear()}`;
            const dateDayandMonthAndYear = schedule.date.toISOString().split('T')[0];
            if (!scheduleGrouped[dateDayandMonthAndYear]) {
                scheduleGrouped[dateDayandMonthAndYear] = [];
            }
            // Add the schedule to the corresponding date group
            const infoToPush = {
                id: schedule.id,
                date: schedule.date,
                hour: `${schedule.date.getUTCHours()} : ${schedule.date.getUTCMinutes().toString().padStart(2, '0')}`,
                candidateName: schedule.application?.candidateName,
                applicationNumber: schedule.application?.number,
                interviewType: schedule.interviewType
            }
            scheduleGrouped[dateDayandMonthAndYear].push(infoToPush);
            return scheduleGrouped;
        });

        return reply.status(200).send({ schedules: scheduleGrouped })

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })

        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: "Edital não encontrado ou assistente não vinculado(a)" })
        }
        if (error instanceof Error) {
            return reply.status(412).send({ message: error.message })

        }
        reply.status(500).send({ message: 'Erro ao buscar horários' })
    }
}