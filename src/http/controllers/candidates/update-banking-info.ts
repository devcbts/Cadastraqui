import { ForbiddenError } from "@/errors/forbidden-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { AccountType } from "./enums/AcountType"

export async function updateBankingInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const BankingInfoDataSchema = z.object({
        agencyNumber: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountType: AccountType.optional(),
        balances: z.array(z.object({
            id: z.string(),
            initialBalance: z.number().refine(e => e > 0),
            entryBalance: z.number().refine(e => e > 0),
            outflowBalance: z.number().refine(e => e > 0),
            totalBalance: z.number().refine(e => e > 0),
            date: z.string().transform(e => {
                const date = new Date(e)
                date.setHours(0)
                return date
            })
        }))
    })

    const BankingInfoParamsSchema = z.object({
        _id: z.string(),
    })
    console.log(request.params)
    // _id === bankAccount_id
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

        // Verifica se existe uma conta bancária cadastrada com o _id
        const bankAccount = await prisma.bankAccount.findUnique({
            where: { id: _id },
        })

        if (!bankAccount) {
            throw new ResourceNotFoundError()
        }
        let bankInfo;
        await prisma.$transaction(async (tsPrisma) => {

            // Atualiza informações acerca do Banking Info no banco de dados
            bankInfo = await tsPrisma.bankAccount.update({
                where: { id: _id },
                data: {
                    bankName,
                    accountNumber,
                    accountType,
                    agencyNumber,
                },
            })
            for (const e of balances) {
                await tsPrisma.bankBalance.update({
                    where: { id: e.id },
                    data: {
                        initialBalance: e.initialBalance,
                        entryBalance: e.entryBalance,
                        outflowBalance: e.outflowBalance,
                        totalBalance: e.totalBalance,
                    }
                })
            }
        })

        return reply.status(200).send({ bankInfo })
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })

        }

        return reply.status(500).send({ message: err.message })
    }
}