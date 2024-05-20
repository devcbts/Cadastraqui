import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function getHealthInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O _id do familiar é opcional
  const queryParamsSchema = z.object({
    _id: z.string().optional(),
  });

  const { _id } = queryParamsSchema.parse(request.params);

  try {
    const user_id = request.user.sub
    let candidateOrResponsible
    let idField
    if (_id) {
      candidateOrResponsible = await ChooseCandidateResponsible(_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    } else {
      // Verifica se existe um candidato associado ao user_id
      candidateOrResponsible = await SelectCandidateResponsible(user_id)
      if (!candidateOrResponsible) {
        throw new ResourceNotFoundError()
      }
      idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    }

    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
    })

    async function fetchData(familyMembers: FamilyMember[]) {
      const healthInfoResults = []
      for (const familyMember of familyMembers) {
        try {
          const familyMemberIncomeInfo = await prisma.familyMemberDisease.findMany({
            where: { familyMember_id: familyMember.id },
          })
          const familyMemberMedicationInfo = await prisma.medication.findFirst({
            where: { familyMember_id: familyMember.id },
          })

          const healthInfo = {
            ...familyMemberIncomeInfo,
            ...familyMemberMedicationInfo,
          }
          healthInfoResults.push({ name: familyMember.fullName, id: familyMember.id, healthInfo })
        } catch (error) {
          throw new ResourceNotFoundError()
        }
      }
      return healthInfoResults
    }
    const candidateDisease = await prisma.familyMemberDisease.findMany({
      where: idField
    })
    const candidateMedication = await prisma.medication.findFirst({
      where: idField
    })
    const healthInfo = {
      ...candidateDisease,
      ...candidateMedication,
    }


    let healthInfoResults = await fetchData(familyMembers)

    healthInfoResults.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, healthInfo })


    return reply.status(200).send({ healthInfoResults })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
