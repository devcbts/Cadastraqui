import { ForbiddenError } from "@/errors/forbidden-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FamilyMember } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { getSectionDocumentsPDF } from "./AWS Routes/get-pdf-documents-by-section"

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
        let hasBankAccount = null
        // identify if user is (candidate or responsible) or family member
        let isUser = null;
        if (_id) {
            const getCurrentMember = await SelectCandidateResponsible(_id)
            // Verifica se existe uma conta bancária cadastrada com o _id
            bankAccounts = await prisma.bankAccount.findMany({
                where: { OR: [{ familyMember_id: _id }, { candidate_id: _id }, { legalResponsibleId: _id }] },
                include: { candidate: { include: { IdentityDetails: true } }, familyMember: true, LegalResponsible: { include: { IdentityDetails: true } } }
            })
            // family member
            if (getCurrentMember === null) {
                const member = await prisma.familyMember.findUnique({
                    where: { id: _id }
                })
                hasBankAccount = member?.hasBankAccount
                isUser = false
            } else {
                // candidate or legal responsible
                const user = await prisma.identityDetails.findFirst({
                    where: { OR: [{ candidate_id: _id }, { responsible_id: _id }] }
                })
                hasBankAccount = user?.hasBankAccount
                isUser = true
            }
            bankAccounts = await Promise.all(bankAccounts.map(async (account) => {
                const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, `statement/${_id}/${account.id}`)
                return { ...account, urls }
            }))
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
                        const bankWithUrls = familyMemberBanks.map(async (account) => {
                            const urls = await getSectionDocumentsPDF(familyMember.id, `statement/${familyMember.id}/${account.id}`)
                            return { ...account, urls }
                        })

                        incomeInfoResults.push({ name: familyMember.fullName, id: familyMember.id, bankInfo: bankWithUrls })
                    } catch (error) {
                        throw new ResourceNotFoundError()
                    }
                }
                return incomeInfoResults
            }

            const candidateBanks = await prisma.bankAccount.findMany({
                where: idField,
            })
            const candidateBankWithUrls = candidateBanks.map(async (account) => {
                const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, `statement/${candidateOrResponsible.UserData.id}/${account.id}`)
                console.log('urls', urls)
                return { ...account, urls }
            })

            bankAccounts = await fetchData(familyMembers)
            bankAccounts.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, bankInfo: candidateBankWithUrls })

        }

        if (!bankAccounts) {
            throw new ResourceNotFoundError()
        }
        console.log('accounts', bankAccounts)

        return reply.status(200).send({ bankAccounts, hasBankAccount, isUser })
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