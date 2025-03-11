import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AccountType } from './enums/AcountType'


export async function registerBankingInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const BankingInfoDataSchema = z.object({
        agencyNumber: z.string(),
        bankName: z.string(),
        accountNumber: z.string(),
        accountType: AccountType,
        balances: z.array(z.object({
            initialBalance: z.number().refine(e => e > 0),
            entryBalance: z.number().refine(e => e > 0),
            outflowBalance: z.number().refine(e => e > 0),
            totalBalance: z.number().refine(e => e > 0),
            date: z.string().transform(e => new Date(e))
        }))
    })

    const BankingInfoParamsSchema = z.object({
        _id: z.string(),
    })

    // _id === family_member_id
    const { _id } = BankingInfoParamsSchema.parse(request.params)

    const {
        bankName,
        accountNumber,
        accountType,
        agencyNumber,
        balances
    } = BankingInfoDataSchema.parse(request.body)

    try {
        const user_id = request.user.sub
        const candidateOrResponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
        }

        // Verifica se existe um familiar cadastrado com o owner_id
        const familyMember = await prisma.familyMember.findUnique({
            where: { id: _id },
        })
        const idField = familyMember
            ? { familyMember_id: _id }
            : candidateOrResponsible.IsResponsible
                ? { legalResponsibleId: candidateOrResponsible.UserData.id }
                : { candidate_id: candidateOrResponsible.UserData.id }
        let id;
        let balancesId: string[] = [];
        await prisma.$transaction(async (tsPrisma) => {

            // Armazena informações acerca do Banking Info no banco de dados
            const account = await tsPrisma.bankAccount.create({
                data: {
                    bankName,
                    accountNumber,
                    accountType,
                    agencyNumber,
                    ...idField,
                },
            })
            // create BankBalance 
            for (const e of balances) {
                const created = await tsPrisma.bankBalance.create({
                    data: {
                        bankAccount_id: account.id,
                        initialBalance: e.initialBalance,
                        entryBalance: e.entryBalance,
                        outflowBalance: e.outflowBalance,
                        totalBalance: e.totalBalance,
                        date: e.date,
                    },
                });
                balancesId.push(created.id);
            }
            // const balances = await tsPrisma.bankBalance.createMany({
            //     data: balance.map(e => ({
            //         bankAccount_id: account.id,
            //         initialBalance: e.initialBalance,
            //         entryBalance: e.entryBalance,
            //         outflowBalance: e.outflowBalance,
            //         totalBalance: e.totalBalance,
            //         date: e.date
            //     }))
            // })
            id = account.id
            if (id) {
                if (familyMember) {
                    await tsPrisma.familyMember.update({
                        where: { id: idField.familyMember_id },
                        data: {
                            hasBankAccount: true
                        }
                    })
                } else {
                    await tsPrisma.identityDetails.update({
                        where: candidateOrResponsible.IsResponsible ? {
                            responsible_id: candidateOrResponsible.UserData.id
                        } : {
                            candidate_id: candidateOrResponsible.UserData.id
                        },
                        data: {
                            hasBankAccount: true
                        }
                    })
                }
            }
        })
        return reply.status(201).send({ id, balancesId })
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}
