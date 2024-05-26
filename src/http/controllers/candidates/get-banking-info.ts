import { ForbiddenError } from "@/errors/forbidden-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FamilyMember } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function getBankingInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const BankingInfoParamsSchema = z.object({
        _id: z.string().optional(),
    })

    // _id === bankAccount_id
    const { _id } = BankingInfoParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub
        const candidateOrResponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
        }
        let bankAccounts
        if (_id) {

            // Verifica se existe uma conta bancária cadastrada com o _id
            bankAccounts = await prisma.bankAccount.findMany({
                where: { OR: [{ familyMember_id: _id }, { candidate_id: _id }, { legalResponsibleId: _id }] },
            })
        }
        else {
            const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

            const familyMembers = await prisma.familyMember.findMany({
                where: idField,
            })

            async function fetchData(familyMembers: FamilyMember[]) {
                const incomeInfoResults = []
                for (const familyMember of familyMembers) {
                    try {
                        const familyMemberBanks = await prisma.bankAccount.findMany({
                            where: { familyMember_id: familyMember.id },
                        })


                        incomeInfoResults.push({ name: familyMember.fullName, id: familyMember.id, bankInfo: familyMemberBanks })
                    } catch (error) {
                        throw new ResourceNotFoundError()
                    }
                }
                return incomeInfoResults
            }

            const candidateBanks = await prisma.bankAccount.findMany({
                where: idField,
            })


            bankAccounts = await fetchData(familyMembers)
            bankAccounts.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, bankInfo: candidateBanks })

        }

        if (!bankAccounts) {
            throw new ResourceNotFoundError()
        }

        return reply.status(200).send({ bankAccounts })
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}