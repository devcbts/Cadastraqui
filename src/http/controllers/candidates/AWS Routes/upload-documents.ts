import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import getOpenApplications from '@/HistDatabaseFunctions/find-open-applications'
import { findAWSRouteHDB, findTableHDBId } from '@/HistDatabaseFunctions/Handle Application/find-AWS-Route'
import { uploadFile } from '@/http/services/upload-file'
import { historyDatabase, prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import verifyDeclarationRegistration from '@/utils/Trigger-Functions/verify-declaration-registration'
import { MultipartFile } from '@fastify/multipart'
import { FastifyReply, FastifyRequest } from 'fastify'
import fs from 'fs'
import { z } from 'zod'
import createCandidateDocument from '../Documents Functions/create-candidate-document'
import createCandidateDocumentHDB from '@/HistDatabaseFunctions/Handle Documents/create-candidate-document'



export const section = z.enum(["identity",
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
    "declaracoes",
    "pix"
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
        const parts = request.parts({ limits: { fileSize: MAX_FILE_SIZE } });
        // for await (const file of parts) {
        //     if (file.file.truncated) {
        //         throw new Error('Arquivo excedente ao limite de 10MB');
        //     }
        //     pump(file.file, fs.createWriteStream(file.filename))
        //     if (fs.existsSync(file.filename)) {
        //         fs.unlinkSync(file.fieldname);
        //     }

        // }
        const files: (MultipartFile & { fileBuffer: any, metadata: object })[] = []
        let metadatas: any = {};
        // get all metadata and files separated
        for await (const part of parts) {
            if (part.fieldname === 'file_metadatas' && part.type === "field") {
                metadatas = JSON.parse(part.value as string)
            }
            if (part.type === "file") {
                // read the file before sending to AWS, need to ensure the data needed for file store isn't lost during the process
                const chunks: any[] = [];
                let fileSize = 0;

                part.file.on('data', (chunk) => {
                    fileSize += chunk.length;
                    chunks.push(chunk);
                });
                part.file.on('end', async () => {
                    if (fileSize >= MAX_FILE_SIZE) {
                        // if it exceeds 10Mb, throw an error before manipulating it
                        throw new Error('Arquivo excedente ao limite de 10MB');
                    }
                    const fileBuffer = Buffer.concat(chunks)
                    // // if part is file, save to files array to consume after
                    files.push({
                        ...part,
                        fileBuffer,
                        metadata: metadatas?.[`metadata_${part.fieldname.split('_')[1]}`] ?? {}
                    })
                })
            }
        }
        let deleteUrl = '';
        for (const part of files) {

            // pump(part.file, fs.createWriteStream(part.filename))
            const fileBuffer = part.fileBuffer;
            const route = `CandidateDocuments/${candidateOrResponsible.UserData.id}/${documentType}/${member_id}/${table_id ? table_id + '/' : ''}${part.fieldname.split('_')[1]}.${part.mimetype.split('/')[1]}`;

            // Inicia transação de envio de documento
            await prisma.$transaction(async (tsPrisma) => {
                // Cria o registro do documento no banco de dados
                await createCandidateDocument(tsPrisma, route, part.metadata, documentType, table_id || member_id);
                const sended = await uploadFile(fileBuffer, route, part.metadata);
                if (!sended) {
                    throw new NotAllowedError();
                }

                const findOpenApplications = await getOpenApplications(candidateOrResponsible.UserData.id);
                for (const application of findOpenApplications) {
                    await historyDatabase.$transaction(async (tsBackupPrisma) => {
                        const routeHDB = await findAWSRouteHDB(candidateOrResponsible.UserData.id, documentType, member_id, table_id, application.id);
                        const tableIdHDB = await findTableHDBId(documentType, member_id, table_id, application.id);
                        const finalRoute = `${routeHDB}${part.fieldname.split('_')[1]}.${part.mimetype.split('/')[1]}`;
                        await createCandidateDocumentHDB(tsBackupPrisma, finalRoute, route, part.metadata, documentType, table_id || member_id,null,application.id);
                        const sended = await uploadFile(fileBuffer, finalRoute, part.metadata);
                        if (!sended) {
                            throw new NotAllowedError();
                        }
                    })
                }
                if (fs.existsSync(part.filename)) {
                    fs.unlinkSync(part.filename)
                }
            })
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