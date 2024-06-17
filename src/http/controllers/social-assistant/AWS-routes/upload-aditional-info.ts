import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadAdtionalInfo(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const uploadParamsSchema = z.object({
        application_id: z.string()
    });

    const { application_id } = uploadParamsSchema.parse(request.params);

    try {
        const user_id = request.user.sub;

        const assistant = await prisma.socialAssistant.findUnique({ where: { user_id } });
        if (!assistant) {
            throw new ForbiddenError();
        }

        const application = await prisma.application.findUnique({ where: { id: application_id } });
        if (application?.socialAssistant_id !== assistant.id) {
            throw new ForbiddenError();
        }




        const data = await request.file();
        if (!data) {
            throw new ResourceNotFoundError();
        }

        const fileBuffer = await data.toBuffer();
        if (!fileBuffer) {
            throw new ResourceNotFoundError();
        }


        const route = `assistantDocuments/${application_id}/aditional`;
        const sended = await uploadFile(fileBuffer, route);

        if (!sended) {
            throw new NotAllowedError();
        }

        reply.status(201).send();
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send();
        } if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send();
        }
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message});
            
        }
        return reply.status(400).send();
    }
}
