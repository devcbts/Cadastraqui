import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { Declaration_Type } from './enums/Declatarion_Type'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { ForbiddenError } from '@/errors/forbidden-error'

export async function getDeclaration(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const DeclarationParamsSchema = z.object({
        _id: z.string(),
        type: Declaration_Type.optional(),
    })

    const { _id, type } = DeclarationParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub
        const isUser = await SelectCandidateResponsible(user_id)
        if (!isUser) {
            throw new ForbiddenError()
        }
        if (!type){
            const declarations = await prisma.declarations.findMany({
                where: {
                    OR: [{ familyMember_id: _id }, { candidate_id: _id }, { legalResponsibleId: _id }],
                },
            })
            
            return reply.status(200).send({ declarations })

        }

        const declaration = await prisma.declarations.findFirst({
            where: {
                OR: [{ familyMember_id: _id }, { candidate_id: _id }, { legalResponsibleId: _id }],
                declarationType: type,
            },
        })

        if (!declaration) {
            throw new ResourceNotFoundError()
        }

        return reply.status(200).send({ declaration })
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })
        }
        return reply.status(500).send({ message: err.message })
    }
}