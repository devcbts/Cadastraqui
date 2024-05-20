import { prisma } from "@/lib/prisma";
import { ChooseCandidateResponsible } from "@/utils/choose-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
import IncomeSource from "./enums/IncomeSource";

export default async function updateIncomeSource(
    request: FastifyRequest,
    response: FastifyReply
) {

    const updateIncomeSourceSchema = z.object({
        id: z.string(),
        incomeSource: z.array(IncomeSource)
    })

    try {
        const { id, incomeSource } = updateIncomeSourceSchema.parse(request.body)
        const isCandidateOrResponsible = await ChooseCandidateResponsible(id)
        const idField = isCandidateOrResponsible ? (isCandidateOrResponsible.IsResponsible ? { responsible_id: id } : { candidate_id: id }) : { familyMember_id: id };
        console.log(id, incomeSource, idField)
        if (isCandidateOrResponsible) {

            await prisma.identityDetails.updateMany({
                where: {
                    ...idField,
                },

                data: {
                    incomeSource
                }
            })

        } else {
            // Atualiza o array de IncomeSource do membro da familia

            await prisma.familyMember.update({
                where: {
                    id: id,

                },
                data: {
                    incomeSource
                }
            })
        }
        return response.status(204).send()
    } catch (err) {

    }
}