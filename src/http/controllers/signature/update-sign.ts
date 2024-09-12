import { NotAllowedError } from "@/errors/not-allowed-error";
import getOpenApplications from "@/HistDatabaseFunctions/find-open-applications";
import { findAWSRouteHDB } from "@/HistDatabaseFunctions/Handle Application/find-AWS-Route";
import { uploadFile } from "@/http/services/upload-file";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/S3";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "process";
import { z } from "zod";
export default async function updateSign(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        document_key: z.string(),
        signing_key: z.string(),
        status: z.enum(['Open', 'Signed', 'Cancelled', 'Declined']),
        webhook_type: z.enum(['REQUESTS_EMAIL_OPENED', 'REQUESTS_UPDATED', 'REQUESTS_CHAIN_UPDATED'])
    }).partial()
    try {
        const plug_api = 'https://app.plugsign.com.br/api'
        const api = axios.create({
            baseURL: plug_api, headers: {
                "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        })
        const {
            document_key,
            signing_key,
            status,
            webhook_type
        } = schema.parse(request.body)
        if (status === 'Signed') {
            // if status === signed, get the current document (file) url and send it to S3 server
            // first step - get file folder (it'll be used as param to save on aws)
            const file = await api.get('/docs', {
                data: {
                    document_key
                }
            })
            if (file.data) {
                const { folder: currentFolder } = file.data.data?.[0]
                const folder = currentFolder.folder
                switch (folder) {
                    case 'parecer':
                        // response is a binary data, must convert into readable file before sending to aws
                        const application = await prisma.application.findUnique({
                            where: { parecerDocumentKey: document_key }
                        });
                        if (!application) {
                            break;
                        }
                        const binaryDataParecer = await api.get(`/files/download/${document_key}`, { responseType: 'arraybuffer', responseEncoding: 'binary' });
                        const routeParecer = `assistantDocuments/${application.id}/parecer/parecer.pdf`;

                        const fileParecer = Buffer.from(binaryDataParecer.data);
                        await uploadToS3(fileParecer, routeParecer);
                        break;
                       
                    default:
                        const documentInAWS = await prisma.signedDocuments.findUnique({
                            where: {documentKey: document_key}
                        })
                        if (!documentInAWS) {
                            break;
                        }
                        await prisma.$transaction(async (tsPrisma) => {
                            await tsPrisma.signedDocuments.update({
                                where: { documentKey: document_key },
                                data: {
                                    status: status,
                                }
                            })
                            const binaryDataParecer = await api.get(`/files/download/${document_key}`, { responseType: 'arraybuffer', responseEncoding: 'binary' });
                            const metadata = documentInAWS.metadata as Object 

                            await uploadFile(binaryDataParecer.data, documentInAWS.path,metadata)
                            const [, candidateOrResponsibleId, section, memberId, tableIdOrFilename, maybeFilename] = documentInAWS.path.split("/");

                            // Verificação condicional para ajustar tableId e filename
                            let tableId = tableIdOrFilename;
                            let filename = maybeFilename;
                        
                            if (!filename) { // Caso não exista o filename, o tableIdOrFilename é o filename
                                filename = tableIdOrFilename;
                                tableId = '';
                            }
                            // Enviar o arquivo para as inscrições abertas
                            const openApplications = await getOpenApplications(candidateOrResponsibleId)
                            for (const application of openApplications) {
                                const routeHDB = await findAWSRouteHDB(candidateOrResponsibleId, section, memberId, tableId, application.id);
                                const finalRoute = `${routeHDB}${filename}`;
                                const fileSigned = Buffer.from(binaryDataParecer.data);
                                await uploadFile(fileSigned, finalRoute, metadata);
                            }
                        })
                        break;
                }

            }
        }
        return response.status(204).send()
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}