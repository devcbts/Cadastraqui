import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import getOpenApplications from '@/HistDatabaseFunctions/find-open-applications'
import { findAWSRouteHDB } from '@/HistDatabaseFunctions/Handle Application/find-AWS-Route'
import { uploadFile } from '@/http/services/upload-file'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import verifyDeclarationRegistration from '@/utils/Trigger-Functions/verify-declaration-registration'
import { FastifyReply, FastifyRequest } from 'fastify'
import fs from 'fs'
import pump from 'pump'
import { z } from 'zod'



const section = z.enum(["identity",
    "housing",
    "family-member",
    "monthly-income",
    "income",
    "bank",
    "registrato",
    "statement",
    "health",
    "medication",
    "vehicle",
    "expenses",
    "loan",
    "financing",
    "credit-card",
    "declaracoes"
])
const MAX_FILE_SIZE = 1024 * 1024 * 10;
export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    const requestParamsSchema = z.object({
        documentType: section,
        member_id: z.string(),
        table_id: z.string().nullable()
    })

    const { documentType, member_id, table_id } = requestParamsSchema.parse(request.params)
    try {
        const user_id = request.user.sub;
        // Verifica se existe um candidato associado ao user_id
        const candidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!candidateOrResponsible) {
            throw new NotAllowedError();
        }
        const parts = request.files({ limits: { fileSize: MAX_FILE_SIZE } });


        let deleteUrl = '';
        for await (const part of parts) {
            if (part.file.truncated) {
                throw new Error('Arquivo excedente ao limite de 10MB');
            }
            pump(part.file, fs.createWriteStream(part.filename))
            const fileBuffer = await part.toBuffer();
            const route = `CandidateDocuments/${candidateOrResponsible.UserData.id}/${documentType}/${member_id}/${table_id ? table_id + '/' : ''}${part.fieldname.split('_')[1]}.${part.mimetype.split('/')[1]}`;
            const sended = await uploadFile(fileBuffer, route);
            console.log(sended, 'ENVIADOOOOO')
            if (!sended) {
                throw new NotAllowedError();
            }

            const findOpenApplications = await getOpenApplications(candidateOrResponsible.UserData.id);
            for (const application of findOpenApplications) {
                const routeHDB = await findAWSRouteHDB(candidateOrResponsible.UserData.id, documentType, member_id, table_id, application.id);
                const finalRoute = `${routeHDB}${part.fieldname.split('_')[1]}.${part.mimetype.split('/')[1]}`;
                const sended = await uploadFile(fileBuffer, finalRoute);
                if (!sended) {
                    throw new NotAllowedError();
                }
            }
            if (fs.existsSync(part.filename)) {
                fs.unlinkSync(part.filename)
            }
            if (documentType === "declaracoes") {
                // Atualizar o status das declaraões
                await verifyDeclarationRegistration(candidateOrResponsible.UserData.id)
            }
            deleteUrl = route
        }



        const folder = deleteUrl?.slice(0, deleteUrl?.lastIndexOf('/'));
        reply.status(201).send({ deleteUrl: folder });
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send({ error });
        } if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ error });
        }
        if (error instanceof Error) {
            return reply.status(413).send({ error });
        }

        return reply.status(400).send({ error });
    }
}