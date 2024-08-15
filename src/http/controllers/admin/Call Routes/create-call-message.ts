import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { UserNotExistsError } from "@/errors/users-not-exists-error"
import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export default async function createCallMessage(request: FastifyRequest, reply: FastifyReply) {
    const createCallMessageBody = z.object({
        message: z.string()
    })
    const createCallMessageParams = z.object({
        call_id: z.number()
    })
    const { message } = createCallMessageBody.parse(request.body)
    const { call_id } = createCallMessageParams.parse(request.params)
    try {
        const user_id = request.user.sub

        const userExists = await prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!userExists) {
            throw new UserNotExistsError()
        }

        const callExists = await prisma.call.findUnique({
            where: { id: call_id, replyer_id: user_id, status: {not : 'CLOSED'} }
        })
        if (!callExists) {
            throw new Error("Chamado não foi encontrado, ou já foi fechado")

        }


       const callMessage = await prisma.$transaction(async (tsPrisma) => {

            const callMessage = await tsPrisma.callMessages.create({
                data: {
                    message,
                    call_id,
                    user_id
                }
            })
            if (callExists.status === 'OPEN') {
                await tsPrisma.call.update({
                    where: { id: call_id },
                    data: {
                        status: 'INPROGRESS',
                        replyer_id: user_id
                    }
                })

            }
            return  callMessage 
        })

        return reply.status(201).send({ callMessage })
    } catch (error: any) {
        if (error instanceof UserNotExistsError) {
            return reply.status(404).send({ message: error.message })
        }
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}