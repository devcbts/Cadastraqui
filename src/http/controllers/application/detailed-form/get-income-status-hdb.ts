import { APIError } from "@/errors/api-error";
import { ForbiddenError } from "@/errors/forbidden-error";
import { historyDatabase } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getMemberIncomeStatusHDB(request: FastifyRequest, reply: FastifyReply) {

    const memberParamsSchema = z.object({
        _id: z.string(),
        application_id: z.string()
    })


    const { application_id, _id } = memberParamsSchema.parse(request.params)
    try {
        const user = await SelectCandidateResponsibleHDB(_id)

        let member;
        let idField;
        let bankAccountUpdated;
        let IncomesUpdated;
        let CCS_Updated;
        if (user === null) {
            member = await historyDatabase.familyMember.findUnique({
                where: { id: _id }
            })
            idField = { familyMember_id: _id }

        } else {
            member = await historyDatabase.identityDetails.findFirst({ where: { AND: [{ OR: [{ candidate_id: _id }, { responsible_id: _id }] }, { application_id }] } });

            idField = member?.responsible_id ? { legalResponsibleId: member?.responsible_id } : { candidate_id: member?.candidate_id }

        }

        if (!member) { throw new APIError('Informações do usuário não encontradas') }
        const [
            bankAccounts,
            incomes,
            pix,
            registrato
        ] = await historyDatabase.$transaction([
            historyDatabase.bankAccount.findMany({
                where: idField
            }),
            // verificar o status da renda
            historyDatabase.familyMemberIncome.findMany({
                where: idField
            }),
            // verificar o status do CCS
            historyDatabase.candidateDocuments.findFirst({
                where: {
                    AND: [
                        { tableName: 'pix' },

                        { tableId: _id },
                        { application_id }
                    ]
                }
            }),
            historyDatabase.candidateDocuments.findFirst({
                where: {
                    AND: [
                        { tableName: 'registrato' },

                        { tableId: _id },
                        { application_id }
                    ]
                }
            })
        ])

        // verificar o status da conta bancária
        if ((!bankAccounts.length && member.hasBankAccount) || member.hasBankAccount === null) {
            bankAccountUpdated = null;
        }
        else if (bankAccounts.some(bankAccount => bankAccount.isUpdated === false)) {
            bankAccountUpdated = false;
        }
        else {
            bankAccountUpdated = true;
        }


        if (!incomes.length) {
            IncomesUpdated = null;
        }
        else if (incomes.some(income => income.isUpdated === false)) {
            IncomesUpdated = false;
        }
        else {
            IncomesUpdated = true;
        }


        if (pix?.status === 'PENDING' || registrato?.status === 'PENDING') {
            CCS_Updated = false;
        }
        else if (!pix || !registrato) {
            CCS_Updated = null;
        }
        else {
            CCS_Updated = true;
        }

        return reply.status(200).send({ bankAccountUpdated, IncomesUpdated, CCS_Updated })


    } catch (error: any) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}