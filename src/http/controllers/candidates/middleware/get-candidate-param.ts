// Temp middleware to show candidate information (subscription form)

import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

// to entities and social assistants. Find a better way to do it
export async function getCandidateOnParam(req: FastifyRequest, res: FastifyReply) {
    try {
        const schema = z.object({
            candidateId: z.string().nullish()
        })
        const { candidateId } = schema.parse(req.query)
        console.log(req.query)
        if (candidateId) {
            console.log('CANDIDATO', candidateId)
            const user = await prisma.user.findFirst({
                where: { OR: [{ Candidate: { id: candidateId } }, { LegalResponsible: { id: candidateId } }] }
            })
            if (!user) {
                throw new APIError('Candidato não encontrado')
            }
            console.log('USER ID', user.id)
            req.user.sub = user.id
        }
        // return res.status(200).send()

    } catch (err) {
        if (err instanceof APIError) {

            return res.status(400).send({ message: err.message })
        }
        return res.status(500).send({ message: 'Erro interno no servidor' })
    }
}