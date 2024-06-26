import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'



// A lógica para a solicitação é ser um tipo específico de histórico, com um prazo específico e com um tipo específico também

export async function createSolicitation(
    request: FastifyRequest,
    reply: FastifyReply,
) {

    const solicitationType = z.enum(['Document', 'Interview', 'Visit'])

    const applicationParamsSchema = z.object({
        application_id: z.string(),

    })
    const applicationBodySchema = z.array(z.object({
        id: z.string().nullish(),
        description: z.string(),
        deadLineTime: z.string().optional().transform((d) => {
            if (d) {
                return new Date(d)
            }
            return undefined
        }),
        solicitation: solicitationType.optional()

    }))
    const { application_id } = applicationParamsSchema.parse(request.params)
    const solicitations = applicationBodySchema.parse(request.body)
    try {
        const userType = request.user.role
        const userId = request.user.sub

        if (userType !== 'ASSISTANT') {
            throw new NotAllowedError()
        }

        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId },
        })

        if (!assistant) {
            throw new ResourceNotFoundError()
        }

        // Criar novo report no histórico da inscrição 

        // Se a solicitação for do tipo de documentos
        await prisma.$transaction(async (tsPrisma) => {
            await Promise.all(
                solicitations.map(async (item) => {
                    const { deadLineTime, description, solicitation, id } = item
                    if (deadLineTime) {
                        // const deadLineDate = new Date()
                        // const deadLine = new Date(deadLineDate.setDate(deadLineDate.getDate() + deadLineTime))
                        await tsPrisma.applicationHistory.create({
                            data: {
                                application_id,
                                description: description,
                                solicitation: solicitation,
                                deadLine: deadLineTime
                            },
                        })
                    }
                    // if id is not null, that means that solicitation already exists
                    if (!id) {
                        await tsPrisma.applicationHistory.create({
                            data: {
                                application_id,
                                description: description,
                                solicitation: solicitation
                            },
                        })
                    }
                })
            )

        })


        return reply.status(201).send({ message: "Solicitação criada com sucesso!" })


    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(403).send({ message: err.message })
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: err.message })
    }
}
