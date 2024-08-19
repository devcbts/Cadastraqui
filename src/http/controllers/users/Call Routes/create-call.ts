import { APIError } from "@/errors/api-error";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { MultipartFile } from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { z } from "zod";
import { UserNotExistsError } from '../../../../errors/users-not-exists-error';

export default async function createCall(request: FastifyRequest, reply: FastifyReply) {
    const createCallBody = z.object({
        socialName: z.string(),
        callSubject: z.string(),
        message: z.string()
    })
    try {
        const parts = request.parts()
        const user_id = request.user.sub

        const userExists = prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!userExists) {
            throw new UserNotExistsError()
        }
        let dataBody;
        let file: { buffer: Buffer, info: MultipartFile };
        for await (const part of parts) {
            if (part.type === "field" && part.fieldname === "data") {
                dataBody = createCallBody.parse(JSON.parse(part.value as string))
            }
            if (part.type === "file" && part.fieldname === "file") {
                file = { buffer: await part.toBuffer(), info: part }
            }
        }
        if (!dataBody) {
            throw new APIError('Dados inválidos')
        }
        const { socialName, callSubject, message } = dataBody


        // const file = await request.file()
        const { call, callMessage } = await prisma.$transaction(async (tsPrisma) => {
            const call = await tsPrisma.call.create({
                data: {
                    socialName,
                    callSubject,
                    creator_id: user_id,
                }
            })

            let filePath;
            if (file) {
                const ext = path.extname(file.info.filename)
                filePath = `callDocuments/${call.id}${ext}`
                // const fileBuffer = await file.toBuffer()
                await uploadFile(file.buffer, filePath)
            }
            const callMessage = await tsPrisma.callMessages.create({
                data: {
                    message,
                    call_id: call.id,
                    user_id: user_id,
                    filePath
                }
            })
            return { call, callMessage }
        })

        return reply.status(201).send({ call, callMessage })
    } catch (error: any) {
        if (error instanceof UserNotExistsError) {
            return reply.status(404).send({ message: error.message })
        }
        console.log(error)
        return reply.status(500).send({ message: error.message })
    }
}