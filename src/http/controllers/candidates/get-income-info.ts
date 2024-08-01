import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { CalculateIncomePerCapita } from '@/utils/Trigger-Functions/calculate-income-per-capita'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'

export async function getIncomeInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub
    let candidateOrResponsible
    let idField

    candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

    // get all family members linked with user
    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
      include: { FamilyMemberIncome: true, BankAccount: true }
    })

    // async function fetchData(familyMembers: FamilyMember[]) {
    const incomeInfoResults = []
    for (const familyMember of familyMembers) {
      try {
        // const familyMemberIncome = await prisma.familyMemberIncome.findMany({
        //   where: { familyMember_id: familyMember.id },
        // })

        const userBanks = familyMember.BankAccount.length
        incomeInfoResults.push({ name: familyMember.fullName, id: familyMember.id, incomes: familyMember.FamilyMemberIncome, hasBankAccount: familyMember.hasBankAccount, userBanks, isUser: false })
      } catch (error) {
        throw new ResourceNotFoundError()
      }
    }
    // return incomeInfoResults
    // }

    const candidateIncome = await prisma.familyMemberIncome.findMany({
      where: idField,
    })
    const userIdentity = await prisma.identityDetails.findFirst({
      where: { OR: [{ candidate_id: candidateOrResponsible.UserData.id }, { responsible_id: candidateOrResponsible.UserData.id }] },
      select: { hasBankAccount: true, candidate: { select: { _count: { select: { BankAccount: true } } } }, responsible: { select: { _count: { select: { BankAccount: true } } } } }
    })
    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'income')
    const userBanks = candidateOrResponsible.IsResponsible ? userIdentity?.responsible?._count.BankAccount : userIdentity?.candidate?._count.BankAccount
    // let incomeInfoResults = await fetchData(familyMembers)
    incomeInfoResults.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, incomes: candidateIncome, hasBankAccount: userIdentity?.hasBankAccount, userBanks, isUser: true })
    const incomeInfoResultsWithUrls = incomeInfoResults.map((familyMember) => {
      const incomesWithUrls = familyMember.incomes.map((income) => {
        const incomeDocuments = Object.entries(urls).filter(([url]) => url.split("/")[4] === income.id)
        return {
          ...income,
          urls: Object.fromEntries(incomeDocuments),
        }
      })
      const isUpdated = !!familyMember.incomes.length && familyMember.incomes.every(income => income.isUpdated);

      return {
        ...familyMember,
        incomes: incomesWithUrls,
        hasBankAccount: familyMember.hasBankAccount,
        isUpdated
      }
    })
    const averageIncome = await CalculateIncomePerCapita(candidateOrResponsible.UserData.id)

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

    return reply.status(500).send({ message: err.message })
  }
}