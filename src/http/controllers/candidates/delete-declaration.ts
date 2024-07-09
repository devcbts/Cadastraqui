import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { Declaration_Type } from "./enums/Declatarion_Type";

export default async function deleteDeclaration(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        _id: z.string(),
        type: Declaration_Type
    })
    try {
        const { _id, type } = schema.parse(request.params)
        const isUser = await SelectCandidateResponsible(_id)
        if (!isUser) {
            throw new ForbiddenError()
        }
        const declaration = await prisma.declarations.findFirst({
            where: {
                AND: [
                    {
                        OR: [{ familyMember_id: _id }, { candidate_id: _id }, { legalResponsibleId: _id }],
                    },
                    { declarationType: type }
                ]

            }
        })
        if (declaration) {
            await prisma.declarations.delete({
                where: { id: declaration.id }
            })

        }
        return response.status(204).send()
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}