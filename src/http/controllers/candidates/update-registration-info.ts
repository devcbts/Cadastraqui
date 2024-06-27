import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";



const possibleSections = z.enum([
    'cadastrante',
    'grupoFamiliar',
    'moradia',
    'veiculos',
    'rendaMensal',
    'despesas',
    'saude',
    'declaracoes',
    'documentos'
])
export async function updateRegistrationInfo(
    request: FastifyRequest,
    reply: FastifyReply,
){
    const registrationBodySchema = z.object({
        status: z.boolean(),
    })
    const registrationParamsSchema = z.object({
        section: possibleSections,
    })
    const { status } = registrationBodySchema.parse(request.body);
    const { section } = registrationParamsSchema.parse(request.params);
    try {
        const user_id = request.user.sub;
        const CandidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!CandidateOrResponsible) {
            throw new ForbiddenError();
        }
        const idField = CandidateOrResponsible.IsResponsible ? { legalResponsibleId: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id };
        await prisma.finishedRegistration.update({
            where: idField,
            data: {
                [section]: status
            }
        })

        reply.status(200).send("Informações atualizadas com sucesso");
    } catch (error: any) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({message: error.message})
        }
        return reply.status(500).send({message: error.message})
    }
}