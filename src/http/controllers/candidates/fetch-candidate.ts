import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchCandidate(
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

        return reply.status(201).send({candidate})
    } catch (err : any) {
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({message: err.message})
        }
        return reply.status(500).send({message: err.message})
    }
}