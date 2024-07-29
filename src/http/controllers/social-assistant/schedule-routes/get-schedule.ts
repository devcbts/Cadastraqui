import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getAssistantSchedule(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        const schedule = await prisma.interviewSchedule.findMany({
            where: { AND: [{ assistant: { user_id: sub } }, { application_id: { not: null } }, { accepted: true }] },
            include: {
                assistantSchedule: true,
                application: { include: { candidate: true } }
            }
        })
        const mappedData = schedule.map(e => {
            const duration = e.assistantSchedule?.duration
            const endDate = new Date(e.date)
            endDate.setMinutes(endDate.getMinutes() + duration!)
            return ({
                ...e,
                candidateName: e.application?.candidate.name,
                endDate
            })
        })
        return response.status(200).send({ schedule: mappedData })
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}