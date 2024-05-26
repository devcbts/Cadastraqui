import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { ChooseCandidateResponsible } from '@/utils/choose-candidate-responsible'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
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

    let candidateOrResponsible
    let idField
    // Verifica se um ID foi fornecido e busca o candidato apropriado

    // Verifica se existe um candidato associado ao user_id
    candidateOrResponsible = await SelectCandidateResponsible(user_id);
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
    })

    // Obtém todos os veículos associados ao candidato
    const familyMemberIds = familyMembers.map(member => member.id);
    if (candidateOrResponsible.UserData.id) {
      familyMemberIds.push(candidateOrResponsible.UserData.id);
    }

    // Get all vehicles where owners_id contains any of the family member ids
    const vehicles = await prisma.vehicle.findMany({
      where: {
        owners_id: {
          hasSome: familyMemberIds,
        },
      },


    });
    // Prepara os resultados, acumulando os nomes dos proprietários
    // Create a map of family member ids to names for easy lookup
    const familyMemberNames = familyMembers.reduce((map, member) => {
      map[member.id] = member.fullName;
      return map;
    }, {} as { [id: string]: string });
    familyMemberNames[candidateOrResponsible.UserData.id] = candidateOrResponsible.UserData.name;

    
    // Prepare the results, pairing the owner's id with the family member's name
    const vehicleInfoResults = vehicles.map(vehicle => {
      const ownerNames = vehicle.owners_id.map(id => familyMemberNames[id]);
      return {
        ...vehicle,
        ownerNames, // Array with the names of all owners
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
