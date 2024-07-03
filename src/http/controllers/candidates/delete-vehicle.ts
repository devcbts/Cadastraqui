import { NotAllowedError } from "@/errors/not-allowed-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function deleteVehicle(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        id: z.string()
    })
    try {
        const { id } = schema.parse(request.params)
        const { sub } = request.user
        const candidateResponsible = await SelectCandidateResponsible(sub)
        if (!candidateResponsible) {
            throw new NotAllowedError()
        }
        await prisma.vehicle.delete({
            where: {
                id: id
            }
        })
        const idField = candidateResponsible.IsResponsible
            ? { legalResponsibleId: candidateResponsible.UserData.id }
            : { candidate_id: candidateResponsible.UserData.id }
        const vehicles = await prisma.vehicle.count({
            where: idField
        })
        await prisma.finishedRegistration.update({
            where: idField,
            data: {
                veiculos: !!vehicles
            }
        })
        return response.status(204).send()
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}