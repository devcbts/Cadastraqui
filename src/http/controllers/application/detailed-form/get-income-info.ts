import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase } from '@/lib/prisma'
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB'
import { CalculateIncomePerCapitaHDB } from '@/utils/Trigger-Functions/calculate-income-per-capita-HDB'
import { BankAccount } from '@prisma/client'
import { FamilyMember } from 'backup_prisma/generated/clientBackup'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from "../../social-assistant/AWS-routes/get-documents-by-section-HDB"

export async function getIncomeInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    application_id: z.string(),
  })

  const { application_id } = queryParamsSchema.parse(request.params)
  try {

    const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    const familyMembers = await historyDatabase.familyMember.findMany({
      where: idField,
      include: { BankAccount: true }
    })
    async function fetchData(familyMembers: (FamilyMember & { BankAccount: BankAccount[] })[]) {
      const incomeInfoResults = []
      for (const familyMember of familyMembers) {
        try {
          const familyMemberIncome = await historyDatabase.familyMemberIncome.findMany({
            where: { familyMember_id: familyMember.id },
          })


          incomeInfoResults.push({
            name: familyMember.fullName, id: familyMember.id, incomes: familyMemberIncome, isIncomeUpdated: familyMember.isIncomeUpdated,
            hasBankAccount: familyMember?.hasBankAccount,
            isBankUpdated: !!(
              (familyMember?.BankAccount.every(e => e.isUpdated) && familyMember?.BankAccount.length)
              || (familyMember?.BankAccount.every(e => e.isUpdated) && familyMember?.BankAccount.length)

            )

          })
        } catch (error) {
          throw new ResourceNotFoundError()
        }
      }
      return incomeInfoResults
    }

    const candidateIncome = await historyDatabase.familyMemberIncome.findMany({
      where: idField,
    })

    const urls = await getSectionDocumentsPDF_HDB(candidateOrResponsible.UserData.id, 'income')

    let incomeInfoResults = await fetchData(familyMembers)
    const userIdentity = await historyDatabase.identityDetails.findFirst({
      where: { OR: [{ candidate_id: candidateOrResponsible.UserData.id }, { responsible_id: candidateOrResponsible.UserData.id }] },
      select: {
        hasBankAccount: true,
        candidate: { select: { _count: { select: { BankAccount: true } }, BankAccount: { select: { isUpdated: true } } } },
        responsible: { select: { _count: { select: { BankAccount: true } }, BankAccount: { select: { isUpdated: true } } }, },
        isIncomeUpdated: true
      }
    })
    incomeInfoResults.push({
      name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, incomes: candidateIncome,
      isIncomeUpdated: userIdentity?.isIncomeUpdated ?? null,
      hasBankAccount: userIdentity?.hasBankAccount ?? null,
      isBankUpdated: (
        !!userIdentity?.candidate
          ? !!userIdentity?.candidate?.BankAccount.length && userIdentity?.candidate?.BankAccount.every(e => e.isUpdated)
          : !!userIdentity?.responsible?.BankAccount.length && userIdentity?.responsible?.BankAccount.every(e => e.isUpdated)
      )

    })
    const incomeInfoResultsWithUrls = incomeInfoResults.map((familyMember) => {
      const incomesWithUrls = familyMember.incomes.map((income) => {
        const incomeDocuments = Object.entries(urls).filter(([url]) => url.split("/")[4] === income.id)
        return {
          ...income,
          urls: Object.fromEntries(incomeDocuments),
        }
      })
      const isUpdated = !!familyMember.incomes.length
        && familyMember.incomes.every(income => income.isUpdated)
        && (familyMember.isBankUpdated || familyMember.hasBankAccount === false);
      console.log(`
          ${familyMember.name} tem ${familyMember.hasBankAccount}  contas no banco, 
          o banco está atualizado (${familyMember.isBankUpdated})
          `)
      return {
        ...familyMember,
        incomes: incomesWithUrls,
        hasBankAccount: familyMember.hasBankAccount,
        isUpdated
      }
    })
    const averageIncome = await CalculateIncomePerCapitaHDB(candidateOrResponsible.UserData.id)
    console.log(averageIncome)
    const incomeInfoResultsWithAverageIncome = incomeInfoResultsWithUrls.map((memberIncome) => {
      const averageMemberIncome = Object.keys(averageIncome.incomesPerMember).find((key) => key === memberIncome.id)
      return {
        ...memberIncome,
        averageIncome: averageMemberIncome ? averageIncome.incomesPerMember[averageMemberIncome] : 0
      }
    })
    return reply.status(200).send({ incomeInfoResults: incomeInfoResultsWithAverageIncome, averageIncome: averageIncome.incomePerCapita })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
