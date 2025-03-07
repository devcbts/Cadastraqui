import { ForbiddenError } from '@/errors/forbidden-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase, prisma } from '@/lib/prisma'
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from '../AWS-routes/get-documents-by-section-HDB'

export async function getVehicleInfoHDB(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const AssistantParamsSchema = z.object({
        application_id: z.string() // _id === candidate_id
    })

    const { application_id } = AssistantParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub;
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id },
            select: { id: true }
        })
        if (!isAssistant) {
            throw new ForbiddenError()

        }
        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
        if (!candidateOrResponsible) {
            throw new ResourceNotFoundError()
        }
        const familyMembers = await historyDatabase.familyMember.findMany({
            where: { application_id: application_id },
        })

        // Obtém todos os veículos associados ao candidato
        const familyMemberIds = familyMembers.map(member => member.id);
        if (candidateOrResponsible.UserData.id) {
            familyMemberIds.push(candidateOrResponsible.UserData.id);
        }

        // Get all vehicles where owners_id contains any of the family member ids
        const vehicles = await historyDatabase.vehicle.findMany({
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

        const urls = await getSectionDocumentsPDF_HDB(candidateOrResponsible.UserData.id, 'vehicle')

        // Prepare the results, pairing the owner's id with the family member's name
        const vehicleInfoResults = vehicles.map(vehicle => {
            const ownerNames = vehicle.owners_id.map(id => familyMemberNames[id]);
            return {
                ...vehicle,
                ownerNames, // Array with the names of all owners
            };
        });


        const vehicleInfoResultsWithUrls = vehicleInfoResults.map((vehicleInfo) => {

            const documents = Object.entries(urls).filter(([url]) => url.split("/")[4] === vehicleInfo.id)
            return {
                ...vehicleInfo,
                urls: Object.fromEntries(documents),
            }

        });
        console.log(vehicleInfoResultsWithUrls[0].urls)
        return reply.status(200).send({ vehicleInfoResults: vehicleInfoResultsWithUrls });



    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message });
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message });

        }
        return reply.status(500).send({ message: err.message });
    }
}
