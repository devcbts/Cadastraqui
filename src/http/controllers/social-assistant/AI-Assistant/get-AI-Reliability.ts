import { CandidateNotFoundError } from "@/errors/candidate-not-found-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { IdentityDetails } from '../../../../../backup_prisma/generated/clientBackup/index';
import detectAnalysisReliability from "@/utils/AI Assistant/detect-analysis-reliability";
import { calculateAge } from "@/utils/calculate-age";
import { CalculateIncomePerCapitaHDB } from "@/utils/Trigger-Functions/calculate-income-per-capita-HDB";

export default async function getAIReliability(
    request: FastifyRequest,
    reply: FastifyReply
){
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
        if(!application){
            throw new ResourceNotFoundError()
        }
        const allAnalysis = await prisma.aIAssistant.findMany({
            where : {application_id}
        })
      
        return reply.status(200).send({
    
            analysisStatus: detectAnalysisReliability(allAnalysis)
        })
    } catch (error:any) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            });
        }
        return reply.status(500).send({message: error.message})
    }
}