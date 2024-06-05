import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function saveAnnouncement(request:FastifyRequest, reply: FastifyReply) {
    const requestParams = z.object({
        announcement_id: z.string(),
    })
    const {announcement_id }= requestParams.parse(request.params)
    try {
        const user_id = request.user.sub;

        const isUser = await SelectCandidateResponsible(user_id);
        if (!isUser) {
            throw new ForbiddenError()
        }
        const announcement = await prisma.announcement.findUnique({
            where: {id: announcement_id}
        })
        if (!announcement) {
            throw new ResourceNotFoundError()
        }
        const annoucementSaved = await prisma.announcementsSeen.findMany({
            where: {announcement_id, OR:[{candidate_id: isUser.UserData.id}, {responsible_id: isUser.UserData.id}]}
        })

        if (annoucementSaved.length > 0) {
            return reply.status(406).send({message: "Announcement already saved"})
        }
        const idField = isUser.IsResponsible ? {responsible_id: isUser.UserData.id} : {candidate_id: isUser.UserData.id}
        await prisma.announcementsSeen.create({
            data: {
                announcement_id,
                ...idField
            }
        })
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({message: error.message})
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({message: error.message})
            
        }
        return reply.status(500).send({message: "Internal server Error"})
    }
    
}