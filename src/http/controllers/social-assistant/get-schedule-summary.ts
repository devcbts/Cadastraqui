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
                        AssistantSchedule: {
                            where: { assistant: { user_id: sub } }
                        }
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
            const interviewTypes = count.filter(i => i.announcement_id === e.id)
            const interviews = interviewTypes.find(i => i.interviewType === 'Interview')?._count.interviewType ?? 0
            const visits = interviewTypes.find(i => i.interviewType === 'Visit')?._count.interviewType ?? 0
            return ({
                ...e,
                interviews,
                visits,
                hasSchedule: e.AssistantSchedule.length !== 0
            })
        })
        return response.status(200).send({ announcements: mappedData })
    } catch (err) {
        return response.status(400).send({ message: 'Erro ao buscar editais' })
    }
}