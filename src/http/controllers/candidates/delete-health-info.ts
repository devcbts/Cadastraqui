import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteHealthInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const medicationParamsSchema = z.object({
        _id: z.string(),
    })

    // _id === familyMemberId
    const { _id } = medicationParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub
        const IsUser = await SelectCandidateResponsible(user_id)
        if (!IsUser) {
            throw new NotAllowedError()
        }
       
        const findHealth = await prisma.familyMemberDisease.findUnique({
            where: {id:_id},
            include: {familyMember:true}
        })
        if (!findHealth) {
            throw new ResourceNotFoundError()
        }
        const user_owner = findHealth.candidate_id || findHealth.legalResponsibleId || findHealth.familyMember?.candidate_id || findHealth.familyMember?.legalResponsibleId
        
        if (user_owner !== user_id) {
            throw new NotAllowedError()
        }
        await prisma.familyMemberDisease.delete({
            where: {
              id: _id,
            },
        })

        return reply.status(204).send()
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}
