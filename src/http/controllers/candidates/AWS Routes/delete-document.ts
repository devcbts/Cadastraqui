import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import mime from 'mime';
import { deleteFile } from '@/http/services/delete-file'
export async function deleteDocument(request: FastifyRequest, reply: FastifyReply) {
    const requestBodySchema = z.object({
        path: z.string()
    })

    const { path } = requestBodySchema.parse(request.body)
    try {
        const user_id = request.user.sub;

        // Verifica se existe um candidato associado ao user_id

       const candidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!candidateOrResponsible) {
            throw new NotAllowedError();
        }
        
           

        await deleteFile(path);

        
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