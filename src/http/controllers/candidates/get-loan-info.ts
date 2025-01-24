import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'

export async function getLoanInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O _id do familiar é opcional
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = queryParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub
    let idField

    // Verifica se existe um candidato associado ao user_id
    const candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new NotAllowedError()
    }
    idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

    const familyMembers = await prisma.familyMember.findMany({
      where: { ...idField },
      select: { id: true },
    })

    const familyMemberIds = familyMembers.map(member => member.id)

    // Busca as informações de Loan no banco de dados
    const loans = await prisma.loan.findMany({
      where: {
        OR: [
          { familyMember: { id: { in: familyMemberIds } } },
          { candidate_id: idField.candidate_id }
        ]
      },
    })

    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'loan')
    const loansWithUrls = loans.map((loan) => {
      const loanDocuments = Object.entries(urls).filter(([url]) => url.split("/")[4] === loan.id)
      return {
        ...loan,
        urls: Object.fromEntries(loanDocuments),
      }
    });
    return reply.status(200).send({ loans: loansWithUrls })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
