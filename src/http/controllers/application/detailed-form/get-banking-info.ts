import { ForbiddenError } from "@/errors/forbidden-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { historyDatabase, prisma } from "@/lib/prisma"
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB"
import { FamilyMember } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { getSectionDocumentsPDF_HDB } from "../../social-assistant/AWS-routes/get-documents-by-section-HDB"

export async function getBankingInfoHDB(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const BankingInfoParamsSchema = z.object({
        application_id: z.string(),
        _id: z.string().optional(),
    })

    // _id === bankAccount_id
    const { application_id, _id } = BankingInfoParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id }
        })
        if (!isAssistant) {
            throw new ForbiddenError()

        }
        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
        if (!candidateOrResponsible) {
            throw new ResourceNotFoundError()
        }
        let bankAccounts
        if (_id) {

            // Verifica se existe uma conta bancária cadastrada com o _id
            bankAccounts = await historyDatabase.bankAccount.findMany({
                where: { OR: [{ familyMember_id: _id }, { candidate_id: _id }, { legalResponsibleId: _id }] },
            })
            bankAccounts = await Promise.all(bankAccounts.map(async (account) => {
                const urls = await getSectionDocumentsPDF_HDB(application_id, `statement/${_id}/${account.id}`)
                return { ...account, urls }
            }))
        }
        else {
            const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

            const familyMembers = await historyDatabase.familyMember.findMany({
                where: { application_id },
            })

            async function fetchData(familyMembers: FamilyMember[]) {
                const incomeInfoResults = []
                for (const familyMember of familyMembers) {
                    try {
                        const familyMemberBanks = await historyDatabase.bankAccount.findMany({
                            where: { familyMember_id: familyMember.id },
                        })
                        const bankWithUrls = familyMemberBanks.map(async (account) => {
                            const urls = await getSectionDocumentsPDF_HDB(familyMember.id, `statement/${familyMember.id}/${account.id}`)
                            return { ...account, urls }
                        })

                        incomeInfoResults.push({ name: familyMember.fullName, id: familyMember.id, bankInfo: bankWithUrls })
                    } catch (error) {
                        throw new ResourceNotFoundError()
                    }
                }
                return incomeInfoResults
            }

            const candidateBanks = await historyDatabase.bankAccount.findMany({
                where: idField,
            })
            const candidateBankWithUrls = candidateBanks.map(async (account) => {
                const urls = await getSectionDocumentsPDF_HDB(application_id, `statement/${candidateOrResponsible.UserData.id}/${account.id}`)
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