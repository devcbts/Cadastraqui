import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { getSignedUrlsGroupedByFolder } from '@/lib/S3'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getDocumentsPDF } from './AWS Routes/get-pdf-documents'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'
export async function getExpensesInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = queryParamsSchema.parse(request.params)

  try {

    const user_id = request.user.sub
    let candidateOrResponsible 
    let idField
    if (_id) {
      candidateOrResponsible = await ChooseCandidateResponsible(_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? {legalResponsibleId: candidateOrResponsible.UserData.id} : {candidate_id: candidateOrResponsible.UserData.id}
    } else {
      // Verifica se existe um candidato associado ao user_id
      candidateOrResponsible = await SelectCandidateResponsible(user_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? {legalResponsibleId: candidateOrResponsible.UserData.id} : {candidate_id: candidateOrResponsible.UserData.id}
    }
    // Busca todas as despesas associadas ao candidato
    const expenses = await prisma.expense.findMany({
      where: idField,
      take: 3,
      orderBy: {
      date: 'desc',
      },
    })
    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'expenses');
    const expensesWithUrls = expenses.map((expense) => {
      const mathcedUrls = Object.entries(urls).filter(([url]) => url.split("/")[4] === expense.id)
      return {
        ...expense,
        urls: Object.fromEntries(mathcedUrls),
      }
    })

    return reply.status(200).send({ expenses: expensesWithUrls })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
