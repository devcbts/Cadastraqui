import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
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

        const CandidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!CandidateOrResponsible) {
            throw new ForbiddenError();
        }

        const solicitation = await prisma.applicationHistory.findUnique({ where: { id: solicitation_id } });
        if (!solicitation) {
            throw new ResourceNotFoundError();
        }

        const application = await prisma.application.findUnique({ where: { id: solicitation.application_id } });
        if (!application) {
            throw new ResourceNotFoundError();
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
        await prisma.applicationHistory.update({
            where: { id: solicitation_id },
            data: {
                answered: true,
            },
        });

        reply.status(201).send();
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send({ message: error.message });
        } if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message });
        }
        return reply.status(400).send();
    }
}
