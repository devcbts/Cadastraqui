
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteSolicitation(
    request: FastifyRequest,
    reply: FastifyReply,
) {

    const applicationParamsSchema = z.object({
        application_id: z.string(),
        id: z.string()

    })

    const { application_id, id } = applicationParamsSchema.parse(request.params)
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
            const solicitation = await tsPrisma.requests.findFirst({
                where: { AND: [{ application_id }, { id }] }
            })
            if (!solicitation?.answered) {
                await tsPrisma.requests.delete({
                    where: { id },
                })
            } else {
                return reply.status(400).send({ message: 'A solicitação não pôde ser excluída pois já foi respondida' })
            }

            // await Promise.all(
            //     solicitations.map(async (item) => {
            //         const { deadLineTime, description, solicitation, id } = item
            //         if (deadLineTime) {
            //             // const deadLineDate = new Date()
            //             // const deadLine = new Date(deadLineDate.setDate(deadLineDate.getDate() + deadLineTime))
            //             await tsPrisma.applicationHistory.create({
            //                 data: {
            //                     application_id,
            //                     description: description,
            //                     solicitation: solicitation,
            //                     deadLine: deadLineTime
            //                 },
            //             })
            //         }
            //         // if id is not null, that means that solicitation already exists
            //         if (!id) {
            //             await tsPrisma.applicationHistory.create({
            //                 data: {
            //                     application_id,
            //                     description: description,
            //                     solicitation: solicitation
            //                 },
            //             })
            //         }
            //     })
            // )

        })


        return reply.status(204).send()


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
