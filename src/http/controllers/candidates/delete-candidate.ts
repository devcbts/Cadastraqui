import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
    const fetchCandidadeSchema = z.object({
        candidate_id: z.string()
    })

    try {
        const {candidate_id} = fetchCandidadeSchema.parse(request.params)

        const candidate = await prisma.candidate.findUnique({
            where: {id: candidate_id}
        })
        if (!candidate) {
            throw new NotAllowedError()
        }
        await prisma.candidate.delete({
            where: {id: candidate_id}
        })
        return reply.status(204).send()
    } catch (err : any) {
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({message: err.message})
        }
        return reply.status(500).send({message: err.message})
    }
}