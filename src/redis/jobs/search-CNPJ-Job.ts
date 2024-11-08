import { env } from "@/env";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { FoundApplicationCNPJ } from '../../../backup_prisma/generated/clientBackup/index';
interface Empresa {
    cnpj: string;
    razao: string;
    fantasia: string;
    dataSociedade: null | string; // Assuming it can be a string date or null
    qualificacao: string;
    situacao: string;
}


export async function searchCNPJJob(
    application_id: string
) {


    try {

        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id);
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
        const familyMembers = await historyDatabase.familyMember.findMany({
            where: {
                application_id
            }
        })

        const memberIds = familyMembers.map(familyMember => familyMember.id);
        await searchMemberCNPJ(candidateOrResponsible.UserData.id, userInfo.CPF! , application_id )
      
        for (let i = 0; i < memberIds.length; i++) {
            await searchMemberCNPJ(memberIds[i], familyMembers[i].CPF!, application_id)
        }
    } catch (error) {
        throw error
    }
}


async function searchMemberCNPJ(member_id: string, memberCPF: string, application_id: string) {


    try {
        const numbersOnlyCPF = memberCPF.replace(/\D/g, '');
        console.log(numbersOnlyCPF);
        const apiFetch = await fetch(`https://api.cpfcnpj.com.br/${env.CPF_CNPJ_KEY}/15/${numbersOnlyCPF}`);
        const data = await apiFetch.json();
        const empresas: Empresa[] = data.empresas;
        const registeredIncome = await historyDatabase.familyMemberIncome.findMany({
            where: {
                OR: [{ candidate_id: member_id }, { legalResponsibleId: member_id }, { familyMember_id: member_id }]
            }
        });
        let InformedCNPJ = registeredIncome.some(registeredIncome => registeredIncome.employmentType === 'BusinessOwner' || registeredIncome.employmentType=== 'BusinessOwnerSimplifiedTax' || registeredIncome.employmentType === 'IndividualEntrepreneur');

        if (empresas?.length) {

            for (const empresa of empresas) {
                const cnpj = empresa.cnpj;
                const findRegisteredEmpresas = registeredIncome.filter((income) =>
                    income.CNPJ ? income.CNPJ.replace(/\D/g, '') === cnpj : false
                );
                if (findRegisteredEmpresas.length === 0) {
                    InformedCNPJ = false;
                }
            }
            const empresasData = empresas.map((empresa) => ({
                cnpj: empresa.cnpj,
                razao: empresa.razao,
                fantasia: empresa.fantasia,
                dataSociedade: empresa.dataSociedade,
                qualificacao: empresa.qualificacao,
                situacao: empresa.situacao,
            }));
            await historyDatabase.applicationMembersCNPJ.upsert({
                where: {  member_id_application_id: { member_id, application_id } },
                create: {

                    member_id,
                    application_id,
                    CPFCNPJ: true,
                    InformedCNPJ,
                    FoundApplicationCNPJ: {
                        createMany: {
                            data: empresasData
                        }
                    }
                },
                update: {
                    CPFCNPJ: true,
                    InformedCNPJ,
                    FoundApplicationCNPJ: {
                        deleteMany: {},
                        createMany: {
                            data: empresasData,
                        },
                    },
                }
            });
        } else {
            await historyDatabase.applicationMembersCNPJ.upsert({
                where: {  member_id_application_id: { member_id, application_id } },
                create: {

                    member_id,
                    application_id,
                    CPFCNPJ: false,
                    InformedCNPJ

                },
                update: {
                    CPFCNPJ: false,
                    InformedCNPJ
                }
            });
        }
    } catch (error) {
        throw error;
    }
}
