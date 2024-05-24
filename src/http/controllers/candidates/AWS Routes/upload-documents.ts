import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import pump from 'pump'
import { z } from 'zod'
import fs from 'fs';

export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    const requestParamsSchema = z.object({
        documentType: z.string(),
        member_id: z.string()
    })

    const { documentType, member_id } = requestParamsSchema.parse(request.params)
    try {
        const user_id = request.user.sub;
        // Verifica se existe um candidato associado ao user_id
        const candidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!candidateOrResponsible) {
            throw new NotAllowedError();
        }

        const parts = request.files()
        for await (const part of parts) {
            pump(part.file, fs.createWriteStream(part.filename))
        
            const fileBuffer = await part.toBuffer();
            const route = `CandidateDocuments/${candidateOrResponsible.UserData.id}/${documentType}/${member_id}/${part.fieldname}.${part.mimetype.split('/')[1]}`;
            const sended = await uploadFile(fileBuffer, route);
            if (!sended) {
                throw new NotAllowedError();
             }
        }




        reply.status(201).send();
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send({ error });
        } if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ error });
        }
        return reply.status(400).send({ error });
    }
}