import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getVehicleInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const vehicleParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === familyMember_id
  const { _id } = vehicleParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({
      where: { user_id },
    })
    if (!candidate) {
      throw new NotAllowedError()
    }

    // Verifica se existe um membro da família associado ao familyMember_id e se ele está associado ao candidato
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id, candidate_id: candidate.id },
    })
    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    // Pega as informações de veículo associadas ao familyMember
    const vehicleInfo = await prisma.vehicle.findMany({
      where: { owner_id: _id },
    })

    return reply.status(200).send({ vehicleInfo })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
