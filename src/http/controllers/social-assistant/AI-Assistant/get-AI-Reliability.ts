import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import detectAnalysisReliability from "@/utils/AI Assistant/detect-analysis-reliability";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAIReliability(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const assistantParamsSchema = z.object({
        application_id: z.string()
    });
    const { application_id } = assistantParamsSchema.parse(request.params);
    try {
        const application = await prisma.application.findUnique({
            where: {
                id: application_id
            }
        });
        if (!application) {
            throw new ResourceNotFoundError()
        }
        const allAnalysis = await prisma.aIAssistant.findMany({
            where: { application_id }
        })
        console.log(allAnalysis)
        return reply.status(200).send({
            analysisStatus: await detectAnalysisReliability(allAnalysis)
        })
    } catch (error: any) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            });
        }
        return reply.status(500).send({ message: error.message })
    }
}