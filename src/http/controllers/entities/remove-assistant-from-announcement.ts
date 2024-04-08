import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
export default async function removeAssistantFromAnnouncement(
    request: FastifyRequest,
    response: FastifyReply
) {
    const removeAssistantSchema = z.object({
        announcement_id: z.string(),
        assistant_id: z.string()
    })
    const { announcement_id, assistant_id } = removeAssistantSchema.parse(request.body)

    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id },
            include: { socialAssistant: true }
        })
        const isAssistantLinked = announcement?.socialAssistant.find((e) => e.id === assistant_id)
        if (!isAssistantLinked) {
            return response.status(400).send({ message: 'Assistente não está vinculado ao edital' })
        }
        const newAssistantsList = announcement?.socialAssistant.filter((e) => e.id !== assistant_id)
        await prisma.announcement.update({
            where: {
                id: announcement_id
            },
            include: { socialAssistant: true },
            data: {
                socialAssistant: {
                    set: newAssistantsList?.map((e) => ({ id: e.id }))
                }
            }
        })
        response.status(204).send()
    } catch (err: any) {
    }
}