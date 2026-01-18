import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { calculateAge } from '@/utils/calculate-age'
import { normalizeString } from '../entities/utils/normalize-string'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'

// Define o tipo para candidateOrResponsible
interface CandidateOrResponsible {
  IsResponsible: boolean
  UserData: {
    id: string
  }
}

export async function getFamilyMemberInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AssistantParamsSchema = z.object({
    _id: z.string().optional(),
  })

  // _id === familyMember_id
  const { _id } = AssistantParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub
    let candidateOrResponsible: CandidateOrResponsible
    let idField
    if (_id) {
      candidateOrResponsible = await ChooseCandidateResponsible(_id) as CandidateOrResponsible
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    } else {
      // Verifica se existe um candidato associado ao user_id
      candidateOrResponsible = await SelectCandidateResponsible(user_id) as CandidateOrResponsible
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    }

    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
    })
    const user = await prisma.identityDetails.findFirst({
      where: { OR: [{ candidate_id: candidateOrResponsible.UserData.id }, { responsible_id: candidateOrResponsible.UserData.id }] },
      select: { livesAlone: true }
    })

    const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'family-member')
    const familyMembersWithUrls = familyMembers.map((familyMember) => {
      const documents = Object.entries(urls).filter(([url]) => url.split("/")[3] === familyMember.id)
      return {
        ...familyMember,
        urls: Object.fromEntries(documents),
      }
    })

    // Para cada membro da família, tenta buscar o enemScore quando for dependente candidato
    const familyMembersWithEnem = await Promise.all(
      familyMembersWithUrls.map(async (familyMember) => {
        let enemScore: any = null

        if (candidateOrResponsible.IsResponsible && familyMember.birthDate) {
          const age = calculateAge(new Date(familyMember.birthDate))

          if (age < 18 && familyMember.CPF) {
            const dependentCandidate = await prisma.candidate.findFirst({
              where: {
                AND: [
                  { CPF: normalizeString(familyMember.CPF) },
                  { responsible_id: candidateOrResponsible.UserData.id },
                ],
              },
            })

            if (dependentCandidate) {
              enemScore = await prisma.enemScore.findUnique({
                where: { candidate_id: dependentCandidate.id },
              })
            }
          }
        }

        return {
          ...familyMember,
          enemScore,
        }
      }),
    )

    // includeSelf on query = true means the candidate will be included on the result
    const { includeSelf } = JSON.parse(JSON.stringify(request.query)) as { includeSelf: string }
    const result = includeSelf === "true"
      ? [...familyMembersWithEnem, candidateOrResponsible.UserData]
      : familyMembersWithEnem

    return reply.status(200).send({ familyMembers: result, livesAlone: user?.livesAlone })

  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
