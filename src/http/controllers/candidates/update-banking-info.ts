import { FastifyReply, FastifyRequest } from "fastify"
import { AccountType } from "./enums/AcountType"
import { z } from "zod"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { ForbiddenError } from "@/errors/forbidden-error"
import { prisma } from "@/lib/prisma"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { NotAllowedError } from "@/errors/not-allowed-error"

export async function updateBankingInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const BankingInfoDataSchema = z.object({
        agencyNumber: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountType: AccountType.optional(),
    })

    const BankingInfoParamsSchema = z.object({
        _id: z.string(),
    })

    // _id === bankAccount_id
    const { _id } = BankingInfoParamsSchema.parse(request.params)

    const {
        bankName,
        accountNumber,
        accountType,
        agencyNumber
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

        // Atualiza informações acerca do Banking Info no banco de dados
      const bankInfo =  await prisma.bankAccount.update({
            where: { id: _id },
            data: {
                bankName,
                accountNumber,
                accountType,
                agencyNumber,
            },
        })

        return reply.status(200).send({bankInfo})
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