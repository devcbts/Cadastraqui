import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getScheduleSummary(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const { sub } = request.user
        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: sub },
            include: {
                Announcement: {
                    include: {
                        AssistantSchedule: true
                    }
                }
            }
        })
        if (!assistant) {
            throw new Error('Assistente não encontrado(a)')
        }
        const count = await prisma.interviewSchedule.groupBy({
            by: ["interviewType", "announcement_id"],
            _count: { interviewType: true },
            where: {
                AND: [{ announcement_id: { in: assistant.Announcement.map(e => e.id) } }, { assistant_id: assistant.id }]
            }
        })
        const mappedData = assistant.Announcement.map((e) => {
            return ({
                ...e,
                hasSchedule: e.AssistantSchedule.length !== 0
            })
        })
        return response.status(200).send({ announcements: mappedData })
    } catch (err) {
        return response.status(400).send({ message: 'Erro ao buscar editais' })
    }
}