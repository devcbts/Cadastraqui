import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadSolicitationDocument(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const uploadParamsSchema = z.object({
        solicitation_id: z.string()
    });

    const { solicitation_id } = uploadParamsSchema.parse(request.params);

    try {
        const user_id = request.user.sub;

        const candidate = await prisma.candidate.findUnique({ where: { user_id } });
        if (!candidate) {
            throw new ResourceNotFoundError();
        }

        const solicitation = await prisma.applicationHistory.findUnique({ where: { id: solicitation_id } });
        if (!solicitation) {
            throw new ResourceNotFoundError();
        }

        const application = await prisma.application.findUnique({ where: { id: solicitation.application_id } });
        if (candidate.id != application?.candidate_id) {
            throw new NotAllowedError();
        }

        const data = await request.file();
        if (!data) {
            throw new ResourceNotFoundError();
        }

        const fileBuffer = await data.toBuffer();
        if (!fileBuffer) {
            throw new ResourceNotFoundError();
        }

        console.log(`File Size: ${fileBuffer.length}`);

        const route = `SolicitationDocuments/${application.id}/${solicitation_id}/${data.filename}`;
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
        return reply.status(400).send();
    }
}
