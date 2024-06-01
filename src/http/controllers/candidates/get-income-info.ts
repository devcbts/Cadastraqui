import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { object, z } from 'zod'
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

    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
    })

    async function fetchData(familyMembers: FamilyMember[]) {
      const incomeInfoResults = []
      for (const familyMember of familyMembers) {
        try {
          const familyMemberIncome = await prisma.familyMemberIncome.findMany({
            where: { familyMember_id: familyMember.id },
          })


          incomeInfoResults.push({ name: familyMember.fullName, id: familyMember.id, incomes: familyMemberIncome })
        } catch (error) {
          throw new ResourceNotFoundError()
        }
      }
      return incomeInfoResults
    }

    const candidateIncome = await prisma.familyMemberIncome.findMany({
      where: idField,
    })

    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'income')

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

    return reply.status(200).send({ incomeInfoResults: incomeInfoResultsWithUrls })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}