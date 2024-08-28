import { EducationLevelNotFoundError } from "@/errors/education-level-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function verifyAssistantAnnouncement(request: FastifyRequest, reply: FastifyReply) {
    const assistantParamsSchema = z.object({
        educationLevel_id: z.string().optional(),
        announcement_id: z.string().optional(),

    })

    const { educationLevel_id, announcement_id } = assistantParamsSchema.parse(request.params);
    try {
        const user_id = request.user.sub;
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id },
        })
        if (!isAssistant) {
            return reply.status(403).send({ message: 'Unauthorized access.' })

        }
        if (announcement_id) {
            const announcement = await prisma.announcement.findUnique({
                where: { id: announcement_id, socialAssistant: { some: { id: isAssistant.id } } },

            })
            if (!announcement) {
                return reply.status(403).send({ message: 'Unauthorized access.' })

            }
        }
        if (educationLevel_id) {
            const educationLevel = await prisma.educationLevel.findUnique({
                where: {
                    id: educationLevel_id,
                    announcement: {
                        socialAssistant: {
                            some: {
                                id: isAssistant.id
                            }
                        }

                    }
                },
            })
            if (!educationLevel) {
                throw new EducationLevelNotFoundError()

            }


        }
    } catch (error) {
        if (error instanceof EducationLevelNotFoundError) {
            return reply.status(404).send({ message: error.message })
            
        }
        return reply.status(500).send({ message: 'Internal server error', error })
    }


}