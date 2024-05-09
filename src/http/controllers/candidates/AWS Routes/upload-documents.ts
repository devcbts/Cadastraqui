import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import mime from 'mime';
export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user_id = request.user.sub;

        // Verifica se existe um candidato associado ao user_id

       const candidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!candidateOrResponsible) {
            throw new NotAllowedError();
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

       
    // Get the file extension from the mimetype
    const fileExtension = mime.getExtension(data.mimetype);

    // Use the file extension in your code
    const route = `CandidateDocuments/${candidateOrResponsible.UserData.id}/${documentType.value}/${data.filename}.${fileExtension}`;
            
       
           

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