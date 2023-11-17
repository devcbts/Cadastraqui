import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user_id = request.user.sub;

        // Verifica se existe um candidato associado ao user_id
        const candidate = await prisma.candidate.findUnique({ where: { user_id } });
        if (!candidate) {
            throw new ResourceNotFoundError();
        }

        const data = await request.file()
        if (!data) {
            throw new ResourceNotFoundError()
        }
        const fileBuffer = await data.toBuffer();
        const documentType = data.fields.documentType
        // Itera sobre as partes do formulário multipart
        
        if (!documentType || !fileBuffer) {
            throw new ResourceNotFoundError();
        }

        console.log(`Document Type: ${documentType}`);
        console.log(`File Size: ${fileBuffer.length}`);

        const route = `CandidateDocuments/${candidate.id}/${documentType.value}/${data.filename}`;
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