import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { uploadQueue } from '@/redis/queues/uploadDocumentsQueue'
import getExpireDate from '@/utils/get-expire-date'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import verifyDeclarationRegistration from '@/utils/Trigger-Functions/verify-declaration-registration'
import { MultipartFile } from '@fastify/multipart'
import { FastifyReply, FastifyRequest } from 'fastify'
import fs from 'fs'
import { z } from 'zod'
import createCandidateDocument from '../Documents Functions/create-candidate-document'
import { CacheManager } from '../../students/CacheManager'
import { DocumentAnalysisStatus } from '@prisma/client'

const cacheManager = new CacheManager();

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
export const MAX_FILE_SIZE = 1024 * 1024 * 10;
export async function uploadDocument(request: FastifyRequest, reply: FastifyReply) {
    const requestParamsSchema = z.object({
        documentType: section,
        member_id: z.string(),
        table_id: z.string().nullable()
    })


    const { documentType, member_id, table_id } = requestParamsSchema.parse(request.params)
    let isIncomeDocument = false;
    try {
        const user_id = request.user.sub;
        // Verifica se existe um candidato associado ao user_id
        const candidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!candidateOrResponsible) {
            throw new NotAllowedError();
        }
        const parts = request.parts({ limits: { fileSize: MAX_FILE_SIZE } });

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
                
                let documentAnalysisStatus: DocumentAnalysisStatus = "NotIncluded";
                let AiData 
                const metadata = part.metadata as object;
                if (metadata && 'id' in metadata) {
                    
                    const id = metadata.id as string;
                    const cachedInfo: {
                        legibilidade: boolean,
                        retifiedReceiver: boolean,
                        grossAmount: string,
                        netIncome: string,
                        coherent: boolean,
                        tries: number
                    } | null | undefined = cacheManager.getCache(id);
                    if (cachedInfo !== null && cachedInfo !== undefined && (cachedInfo.legibilidade && cachedInfo.retifiedReceiver && cachedInfo.coherent)) {
                        documentAnalysisStatus = "Approved";

                    }else{
                        documentAnalysisStatus = "Forced";
                    }
                    AiData = cachedInfo;
                }

                await createCandidateDocument(tsPrisma, route, part.metadata, documentType, table_id || member_id, member_id, getExpireDate(documentType, part.metadata), documentAnalysisStatus, AiData ?? undefined);
                const sended = await uploadFile(fileBuffer, route, part.metadata);
                if (!sended) {
                    throw new NotAllowedError();
                }
                await uploadQueue.add({
                    route,
                    metadata: part.metadata,
                    documentType,
                    table_id,
                    member_id,
                    user_id: candidateOrResponsible.UserData.id
                });


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
        console.log(error)
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