import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import mime from 'mime';
import { deleteFile } from '@/http/services/delete-file'
import { findAWSRouteHDB } from '@/HistDatabaseFunctions/Handle Application/find-AWS-Route'
import { getOpenAnnouncements } from '../get-open-announcements'
import { ForbiddenError } from '@/errors/forbidden-error'
import getOpenApplications from '@/HistDatabaseFunctions/find-open-applications'
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
        const section = path.split('/')[2]
        const fileName = path.split('/')[-1]
        const memberId = path.split('/')[3]
        let tableId = path.split('/')[4]
        if (fileName === tableId) {
            tableId = ''
        }
        const candidateOrResponsibleId = path.split('/')[1]
        if(candidateOrResponsibleId != candidateOrResponsible.UserData.id){
            throw new ForbiddenError()
        }

        const findOpenApplications = await getOpenApplications(candidateOrResponsibleId)
        await deleteFile(path);
        for (const application of findOpenApplications) {
            const routeHDB = await findAWSRouteHDB(candidateOrResponsible.UserData.id, section, memberId, tableId, application.id);
            const finalRoute = `${routeHDB}${fileName}`;
            await deleteFile(finalRoute)
            
        }

        return reply.status(204).send();
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send({message: error.message});
        } if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({message: error.message});
        }
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({message: error.message})
        }
        return reply.status(400).send();
    }
}