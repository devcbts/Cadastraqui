import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function verifyAssistantEnroll(request: FastifyRequest, reply: FastifyReply) {
    const declarationsParamsSchema = z.object({
        application_id: z.string(),

    })

    const { application_id } = declarationsParamsSchema.parse(request.params);
    try {
        const user_id = request.user.sub;
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id },
        })
        if (!isAssistant) {
            return reply.status(403).send({ message: 'Unauthorized access.' })
            
        }
        const application = await prisma.application.findUnique({
            where: { id: application_id, socialAssistant_id: isAssistant.id },
        })

        if (!application) {
            return reply.status(403).send({ message: 'Acesso não autorizado' })
            
        }
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error', error })
    }
    

}