import { historyDatabase } from "@/lib/prisma";
import { SelectCandidateResponsible } from "../../../utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { env } from "@/env";

export async function findCPF_CNPJ(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestParamsSchema = z.object({
        application_id: z.string(),
    });
    
    const { application_id } = requestParamsSchema.parse(request.params);
    try {

        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id);
        let CPF = '';
        if (!candidateOrResponsible) {
            throw new ResourceNotFoundError();

        }
            const userInfo = await historyDatabase.identityDetails.findUnique({
                where: { application_id },
                select: { CPF: true }
            })
            if (!userInfo) {
                throw new ResourceNotFoundError()
            }
            CPF = userInfo.CPF!;

      
        const numbersOnlyCPF = CPF.replace(/\D/g, '');
        console.log(numbersOnlyCPF)
        const apiFetch = await fetch(`https://api.cpfcnpj.com.br/${env.CPF_CNPJ_KEY}/15/${numbersOnlyCPF}`);
        return reply.status(200).send(await apiFetch.json());
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}