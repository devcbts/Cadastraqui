import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserNotExistsError } from '../../../../errors/users-not-exists-error';
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/http/services/upload-file";

export default async function createCall(request: FastifyRequest, reply: FastifyReply) {
    const createCallBody = z.object({
        socialName: z.string(),
        callSubject: z.string(),
        message: z.string()
    })
    const { socialName, callSubject, message } = createCallBody.parse(request.body)
    try {
        const user_id = request.user.sub

        const userExists = prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!userExists) {
            throw new UserNotExistsError()
        }

        const file = await request.file()
        const { call, callMessage } = await prisma.$transaction(async (tsPrisma) => {
            const call = await tsPrisma.call.create({
                data: {
                    socialName,
                    callSubject,
                    creator_id: user_id,
                }
            })

            const callMessage = await tsPrisma.callMessages.create({
                data: {
                    message,
                    call_id: call.id,
                    user_id: user_id
                }
            })
            if (file) {

                const path = `callDocuments/${call.id}`
                const fileBuffer = await file.toBuffer()
                await uploadFile(fileBuffer, path)
            }
            return { call, callMessage }
        })

        return reply.status(201).send({ call, callMessage })
    } catch (error: any) {
        if (error instanceof UserNotExistsError) {
            return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}