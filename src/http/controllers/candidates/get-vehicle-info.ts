import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getVehicleInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AssistantParamsSchema = z.object({
    _id: z.string().optional(), // _id === candidate_id
  })

  const { _id } = AssistantParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub;
    const role = request.user.role;
    if (role === 'RESPONSIBLE') {
      const responsible = await prisma.legalResponsible.findUnique({
        where: { user_id}
      })
      if (!responsible) {
        throw new NotAllowedError()
      }

      // Obtém todos os veículos associados ao candidato
    const vehicles = await prisma.vehicle.findMany({
      where: {
        FamilyMemberToVehicle: {
          some: {
            familyMembers: {
              legalResponsibleId: responsible.id,
            },
          },
        },
      },
      include: {
        FamilyMemberToVehicle: {
          include: {
            familyMembers: true,
          },
        },
      },
    });

    // Prepara os resultados, acumulando os nomes dos proprietários
    const vehicleInfoResults = vehicles.map(vehicle => {
      const ownerNames = vehicle.FamilyMemberToVehicle.map(fmv => fmv.familyMembers.fullName);
      return {
        ...vehicle,
        ownerNames, // Array com os nomes de todos os proprietários
      }});
      return reply.status(200).send({ vehicleInfoResults })
    }
    let candidate;

    // Verifica se um ID foi fornecido e busca o candidato apropriado
    if (_id) {
      candidate = await prisma.candidate.findUnique({
        where: { id: _id },
      })
    } else {
      // Busca o candidato associado ao user_id
      candidate = await prisma.candidate.findUnique({
        where: { user_id },
      })
    }

    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Obtém todos os veículos associados ao candidato
    const vehicles = await prisma.vehicle.findMany({
      where: {
        FamilyMemberToVehicle: {
          some: {
            familyMembers: {
              candidate_id: candidate.id,
            },
          },
        },
      },
      include: {
        FamilyMemberToVehicle: {
          include: {
            familyMembers: true,
          },
        },
      },
    });

    // Prepara os resultados, acumulando os nomes dos proprietários
    const vehicleInfoResults = vehicles.map(vehicle => {
      const ownerNames = vehicle.FamilyMemberToVehicle.map(fmv => fmv.familyMembers.fullName);
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
