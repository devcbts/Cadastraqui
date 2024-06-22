import { env } from "@/env";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
interface Empresa {
    cnpj: string;
    razao: string;
    fantasia: string;
    dataSociedade: null | string; // Assuming it can be a string date or null
    qualificacao: string;
    situacao: string;
}
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

        const data = await apiFetch.json();
        const empresas: Empresa[] = data.empresas;
        const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

        if (empresas.length) {
            let InformedCNPJ = true;
            const registeredIncome = await historyDatabase.familyMemberIncome.findMany({
                where: {
                    ...idField,

                }
            })
            empresas.forEach(async empresa => {
                const cnpj = empresa.cnpj;

                const findRegisteredEmpresas = registeredIncome.filter(registeredIncome => registeredIncome.CNPJ ? registeredIncome.CNPJ.replace(/\D/g, '') === cnpj : '');
                if (findRegisteredEmpresas.length < 0) {
                    InformedCNPJ = false;
                }

            });



            await prisma.application.update({
                where: { id: application_id },
                data: {
                    CPFCNPJ: true,
                    InformedCNPJ
                }
            })
        }
        else {
            await prisma.application.update({
                where: { id: application_id },
                data: {
                    CPFCNPJ: false,
                    InformedCNPJ: true
                }
            })
        }
        return reply.status(200).send(data);
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }
        console.log(error)
        return reply.status(500).send({ message: 'Internal server error' });
    }
}