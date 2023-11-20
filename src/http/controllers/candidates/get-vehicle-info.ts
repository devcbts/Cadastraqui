import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
export async function getVehicleInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AssistantParamsSchema = z.object({
    _id: z.string().optional(),
  })

  // _id === familyMember_id
  const { _id } = AssistantParamsSchema.parse(request.params)
  try {
    const user_id = request.user.sub;
    console.log('====================================');
    console.log(request.user);
    console.log('====================================');
    const role = request.user.role
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
    // Obtém todos os veículos associados aos membros da família do candidato
    const vehicles = await prisma.vehicle.findMany({
      where: {
        owners: {
          some: {
            candidate_id: candidate.id,
          },
        },
      },
      include: {
        owners: true, // Inclui os proprietários no resultado
      },
    });

    // Prepara os resultados, acumulando os nomes dos proprietários
    const vehicleInfoResults = vehicles.map(vehicle => {
      const ownerNames = vehicle.owners.map(owner => owner.fullName);
      return {
        ...vehicle,
        ownerNames, // Array com os nomes de todos os proprietários
      };
    });

    return reply.status(200).send({ vehicleInfoResults });
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send({ message: err.message });
  }
}
