import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { Multipart } from '@fastify/multipart'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user_id = request.user.sub;

        // Verifica se existe um candidato associado ao user_id

        const responsible = await prisma.legalResponsible.findUnique({
            where: { user_id: user_id}
        })

        const candidate = await prisma.candidate.findUnique({ where: { user_id } });
        if (!candidate && !responsible) {
            throw new ResourceNotFoundError();
        }

        const data = await request.file()
        if (!data) {
            throw new ResourceNotFoundError()
        }
        const fileBuffer = await data.toBuffer();
        const documentType = data.fields.documentType as any; // Assegura que documentType é do tipo Multipart        // Itera sobre as partes do formulário multipart
        
        if (!documentType || !fileBuffer) {
            throw new ResourceNotFoundError();
        }

        console.log(`Document Type: ${documentType}`);
        console.log(`File Size: ${fileBuffer.length}`);
        let route
        if (candidate) {
            
             route = `CandidateDocuments/${candidate.id}/${documentType.value}/${data.filename}`;
        }
        else if (responsible) {
             route = `CandidateDocuments/${responsible.id}/${documentType.value}/${data.filename}`;

        } else{
            throw new ResourceNotFoundError()
        }
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