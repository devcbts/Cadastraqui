import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getVehicleInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({
      where: { user_id },
    })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um membro da família associado ao familyMember_id e se ele está associado ao candidato
    const familyMembers = await prisma.familyMember.findMany({
      where: { candidate_id: candidate.id },
    })

    async function fetchData(familyMembers: FamilyMember[]) {
      const vehicleInfoResults = []
      for (const familyMember of familyMembers) {
        try {
          const vehicleInfo = await prisma.vehicle.findMany({
            where: { owner_id: familyMember.id },
          })

          vehicleInfoResults.push({ name: familyMember.fullName, vehicleInfo })
        } catch (error) {
          throw new ResourceNotFoundError()
        }
      }
      return vehicleInfoResults
    }

    const vehicleInfoResults = await fetchData(familyMembers)

    return reply.status(200).send({ vehicleInfoResults })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
