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
                    case 'declaracoes':
                        const declaration = await prisma.declarations.findUnique({
                            where: { documentKey: document_key },
                            include: {
                                familyMember: {

                                }, candidate: true, LegalResponsible: true
                            }
                        });
                        if (!declaration) {
                            break;
                        }

                        const memberId = declaration.familyMember?.id || declaration.candidate?.id || declaration.LegalResponsible?.id;
                        const candidateOrResponsibleId = declaration.candidate_id || declaration.legalResponsibleId || declaration.familyMember?.candidate_id || declaration.familyMember?.legalResponsibleId;



                        
                        const binaryDataDeclaration = await api.get(`/files/download/${document_key}`, { responseType: 'arraybuffer', responseEncoding: 'binary' });
                        const getDocumentInPlugSign = await api.get(`/docs`, { data: { document_key } });

                        const DocumentInfoInPlugSign = getDocumentInPlugSign.data.data[0];

                        const routeDeclaration = `CandidateDocuments/${candidateOrResponsibleId}/declaracoes/${memberId}/${DocumentInfoInPlugSign.name}.pdf`;

                        const fileDeclaration = Buffer.from(binaryDataDeclaration.data);

                        await uploadFile(fileDeclaration, routeDeclaration);
                        const findOpenApplications = await getOpenApplications(candidateOrResponsibleId!);
                        for (const application of findOpenApplications) {
                            const routeHDB = await findAWSRouteHDB(candidateOrResponsibleId!, 'declaracoes', memberId!, '', application.id);
                            const finalRoute = `${routeHDB}${DocumentInfoInPlugSign.name}.pdf`;
                            const sended = await uploadFile(fileDeclaration, finalRoute);
                            if (!sended) {
                                throw new NotAllowedError();
                            }
                        }
                        break;
                    default:
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