import { APIError } from '@/errors/api-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function getGrantedScholarships(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const schema = z.object({
        educationalLevel_id: z.string()
    })

    const { educationalLevel_id } = schema.parse(request.params)
    try {
        const course = await prisma.educationLevel.findUnique({
            where: { id: educationalLevel_id }
        })
        if (!course) {
            throw new APIError('Curso não encontrado')
        }
        const scholarships = await prisma.scholarshipGranted.findMany({
            where: { application: { educationLevel_id: educationalLevel_id } }
        })
        return reply.status(200).send({ scholarships })


    } catch (err: any) {
        if (err instanceof APIError) {
            return reply.status(400).send({ message: err.message })
        }

        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}
