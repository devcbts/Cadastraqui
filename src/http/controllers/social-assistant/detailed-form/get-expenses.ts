import { ForbiddenError } from '@/errors/forbidden-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase, prisma } from '@/lib/prisma'
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from '../AWS-routes/get-documents-by-section-HDB'
export async function getExpensesInfoHDB(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    application_id: z.string()
  })

  const { application_id } = queryParamsSchema.parse(request.params)

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
    const idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

    // Busca todas as despesas associadas ao candidato
    const expenses = await historyDatabase.expense.findMany({
      where: idField,
      take: 3,
      orderBy: {
        date: 'desc',
      },
    })
    const urls = await getSectionDocumentsPDF_HDB(candidateOrResponsible.UserData.id, 'expenses');
    const expensesWithUrls = expenses.map((expense) => {
      const mathcedUrls = Object.entries(urls).filter(([url]) => url.split("/")[4] === expense.id)
      return {
        ...expense,
        urls: Object.fromEntries(mathcedUrls),
      }
    })

    return reply.status(200).send({ expenses: expensesWithUrls })
  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
