import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase, prisma } from '@/lib/prisma'
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB'
import { FamilyMember } from 'backup_prisma/generated/clientBackup'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from '../AWS-routes/get-documents-by-section-HDB'
import { CalculateIncomePerCapitaHDB } from '@/utils/Trigger-Functions/calculate-income-per-capita-HDB'

export async function getIncomeInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    application_id: z.string(),
  })

  const {application_id } = queryParamsSchema.parse(request.params)
  try {

    const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    const familyMembers = await historyDatabase.familyMember.findMany({
      where: idField,
    })
    async function fetchData(familyMembers: FamilyMember[]) {
      const incomeInfoResults = []
      for (const familyMember of familyMembers) {
        try {
          const familyMemberIncome = await historyDatabase.familyMemberIncome.findMany({
            where: { familyMember_id: familyMember.id },
          })


          incomeInfoResults.push({ name: familyMember.fullName, id: familyMember.id, incomes: familyMemberIncome })
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

    incomeInfoResults.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, incomes: candidateIncome })
    const incomeInfoResultsWithUrls = incomeInfoResults.map((familyMember) => {
      const incomesWithUrls = familyMember.incomes.map((income) => {
        const incomeDocuments = Object.entries(urls).filter(([url]) => url.split("/")[4] === income.id)
        return {
          ...income,
          urls: Object.fromEntries(incomeDocuments),
        }
      })
      return {
        ...familyMember,
        incomes: incomesWithUrls,
      }
    })
    const averageIncome = await CalculateIncomePerCapitaHDB(candidateOrResponsible.UserData.id)

    const incomeInfoResultsWithAverageIncome = incomeInfoResultsWithUrls.map((memberIncome) =>{
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
