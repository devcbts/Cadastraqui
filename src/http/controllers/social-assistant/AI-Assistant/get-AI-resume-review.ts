import { CandidateNotFoundError } from "@/errors/candidate-not-found-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import detectAnalysisReliability from "@/utils/AI Assistant/detect-analysis-reliability";
import { calculateAge } from "@/utils/calculate-age";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { CalculateIncomePerCapitaHDB } from "@/utils/Trigger-Functions/calculate-income-per-capita-HDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAssistantResumeReview(
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
        const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id);
        if (!candidateOrResponsibleHDB) {
            throw new CandidateNotFoundError();
        }



        // candidato
        const candidate = await historyDatabase.candidate.findUniqueOrThrow({
            where: {
                application_id
            }
        });
        //responsável
        const responsible = await historyDatabase.legalResponsible.findUnique({
            where: {
                application_id
            }
        });

        const IdentityDetails = await historyDatabase.identityDetails.findUniqueOrThrow({
            where: {
                application_id
            }
        })

        //grupo familiar

        let familyMembers = await historyDatabase.familyMember.findMany({
            where: {
                application_id
            }
        });


        // dados do candidato
        let candidateInfo;

        if (candidateOrResponsibleHDB.IsResponsible) {
            const candidateMember = familyMembers.find((member) => member.CPF === candidate.CPF);
            if (!candidateMember) {
                throw new CandidateNotFoundError();
            }
            // Remove the candidateMember from familyMembers
            familyMembers = familyMembers.filter((member) => member.CPF !== candidate.CPF);
            const candidateAnalysis = allAnalysis.find((analysis) => analysis.member_id === candidateMember.id && analysis.section === 'FAMILY_MEMBER');
            candidateInfo = {
                name: candidateMember.fullName,
                analysis: candidateAnalysis
            }
        } else {
            const candidateAnalysis = allAnalysis.find((analysis) => analysis.member_id === candidate.id && analysis.section === 'IDENTITY');
            candidateAnalysis?.status
            candidateInfo = {
                name: candidate.name,
                analysis: candidateAnalysis
            }
        }

        // dados do responsável
        let responsibleInfo = {};
        if (candidateOrResponsibleHDB.IsResponsible) {
            const responsibleAnalysis = allAnalysis.find((analysis) => analysis.member_id === responsible?.id && analysis.section === 'IDENTITY');

            responsibleInfo = {
                name: IdentityDetails.fullName,
                analysis: responsibleAnalysis,
                analysisStatus: responsibleAnalysis ? await detectAnalysisReliability([responsibleAnalysis]) : null
            }
        }


        // dados do grupo familiar
        const familyMembersInfo = await Promise.all(familyMembers.map(async (member) => {
            const analysis = allAnalysis.find((analysis) => analysis.member_id === member.id && analysis.section === 'FAMILY_MEMBER');
            return {
                name: member.fullName,
                age: calculateAge(member.birthDate),
                relationship: member.relationship,

                analysis,
                analysisStatus: analysis ? await detectAnalysisReliability([analysis]) : null
            }
        }));

        // renda do grupo familiar
        const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapitaHDB(candidateOrResponsibleHDB.UserData.id)
        const familyGroupIncome = await Promise.all(familyMembers.map(async (member) => {
            const analysis = allAnalysis.find((analysis) => analysis.member_id === member.id && (analysis.section === 'INCOME' || analysis.section === 'BANK' || analysis.section === 'PIX' || analysis.section === 'REGISTRATO'));
            return {
                name: member.fullName,
                age: calculateAge(member.birthDate),
                relationship: member.relationship as string,
                profession: member.profession,
                income: incomesPerMember[member.id],
                analysis,
                analysisStatus: analysis ? await detectAnalysisReliability([analysis]) : null
            }
        }))
        const candidateOrResponsibleIncomeAnalysis = allAnalysis.find((analysis) => analysis.member_id === candidateOrResponsibleHDB.UserData.id && (analysis.section === 'INCOME' || analysis.section === 'BANK' || analysis.section === 'PIX' || analysis.section === 'REGISTRATO'));
        const candidateOrResponsibleIncome = {
            name: IdentityDetails.fullName,
            age: calculateAge(IdentityDetails.birthDate),
            relationship: 'Próprio',
            profession: IdentityDetails.profession,
            income: incomesPerMember[candidateOrResponsibleHDB.UserData.id],
            analysis: candidateOrResponsibleIncomeAnalysis,
            analysisStatus: candidateOrResponsibleIncomeAnalysis ? await detectAnalysisReliability([candidateOrResponsibleIncomeAnalysis]) : null
        }
        familyGroupIncome.push(candidateOrResponsibleIncome);


        return reply.status(200).send({
            candidate: candidateInfo,
            responsible: responsibleInfo,
            familyMembers: familyMembersInfo,
            familyGroupIncome,
            incomePerCapita,
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