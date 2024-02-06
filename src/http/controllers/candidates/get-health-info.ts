import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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
    let candidate;

    if (_id) {
      candidate = await prisma.candidate.findUnique({
        where: { id: _id },
      })
    } else {

      // Verifica se existe um candidato associado ao user_id
      candidate = await prisma.candidate.findUnique({
        where: { user_id },
      })
    }
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um membro da família associado ao familyMember_id e se ele está associado ao candidato
    const familyMembers = await prisma.familyMember.findMany({
      where: { candidate_id: candidate.id },
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

          healthInfoResults.push({ name: familyMember.fullName, healthInfo })
        } catch (error) {
          throw new ResourceNotFoundError()
        }
      }
      return healthInfoResults
    }

    const healthInfoResults = await fetchData(familyMembers)

    return reply.status(200).send({ healthInfoResults })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
