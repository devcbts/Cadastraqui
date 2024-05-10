import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import mime from 'mime';
export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    
    const requestParamsSchema = z.object({
        documentType: z.string(),
        member_id: z.string()
    })

    const {documentType
        , member_id} = requestParamsSchema.parse(request.params)
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
        

       
    // Get the file extension from the mimetype
    const fileExtension = mime.getExtension(data.mimetype);

    // Use the file extension in your code
    const route = `CandidateDocuments/${candidateOrResponsible.UserData.id}/${documentType}/${member_id}/${data.filename}.${fileExtension}`;
            
       
           

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