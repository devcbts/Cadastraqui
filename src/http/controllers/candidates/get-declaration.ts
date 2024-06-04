import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { Declaration_Type } from './enums/Declatarion_Type'

export async function getDeclaration(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const DeclarationParamsSchema = z.object({
        _id: z.string(),
        type: Declaration_Type,
    })

    const { _id, type } = DeclarationParamsSchema.parse(request.params)

    try {
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

        return reply.status(500).send({ message: err.message })
    }
}