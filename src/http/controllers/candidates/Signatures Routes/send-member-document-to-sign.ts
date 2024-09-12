import { env } from "@/env";
import { FileNotFoundError } from "@/errors/file-not-found";
import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import axios from 'axios';
import { FastifyReply, FastifyRequest } from "fastify";
import FormData from 'form-data';
import { PDFDocument } from 'pdf-lib';
import { z } from "zod";
import { Declaration_Type } from "../enums/Declatarion_Type";
import { section } from "../AWS Routes/upload-documents";
import { MultipartFile } from "@fastify/multipart";


const MAX_FILE_SIZE = 1024 * 1024 * 10;

export async function sendMemberDocumentToSign(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const documentParams = z.object({
        documentType: section,
        member_id: z.string(),
        table_id: z.string().nullable()
    })

    const emailBody = z.object({
        emails: z.array(z.string().email()),
    })
    const { member_id, documentType, table_id } = documentParams.parse(request.params)
    const { emails } = emailBody.parse(request.body)
    try {
        const user_id = request.user.sub
        const candidateOrResponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
        }
        const member = candidateOrResponsible.UserData.id === member_id ? candidateOrResponsible.UserData : await prisma.familyMember.findUnique({

            where: { id: member_id }
        }
        )


        if (!member) {
            throw new ResourceNotFoundError()
        }

        const parts = request.parts({ limits: { fileSize: MAX_FILE_SIZE } });

        let file: MultipartFile & { fileBuffer: any, metadata: object } = {} as any;
        let metadatas: any = {};

        // Obter todos os metadados e o primeiro arquivo
        for await (const part of parts) {
            if (part.fieldname === 'file_metadatas' && part.type === "field") {
                metadatas = JSON.parse(part.value as string);
            }
            if (part.type === "file") {
                // Ler o arquivo antes de enviar para AWS, garantindo que os dados necessários para o armazenamento do arquivo não sejam perdidos durante o processo
                const chunks: any[] = [];
                let fileSize = 0;

                part.file.on('data', (chunk) => {
                    fileSize += chunk.length;
                    chunks.push(chunk);
                });

                part.file.on('end', async () => {
                    if (fileSize >= MAX_FILE_SIZE) {
                        // Se exceder 10MB, lançar um erro antes de manipulá-lo
                        throw new Error('Arquivo excede o limite de 10MB');
                    }
                    const fileBuffer = Buffer.concat(chunks);
                    // Se a parte for um arquivo, salvar para a variável file e parar o loop
                    file = {
                        ...part,
                        fileBuffer,
                        metadata: metadatas?.[`metadata_${part.fieldname.split('_')[1]}`] ?? {}
                    };
                });

                // Parar o loop após lidar com o primeiro arquivo
                break;
            }
        }

        // Verificar se um arquivo foi encontrado e processado
        if (!file) {
            throw new Error('Nenhum arquivo foi encontrado');
        }

        const fileBuffer = await file.toBuffer();
        const lastPage = await countPdfPages(fileBuffer)
        const formData = new FormData();
        formData.append('name', file.fieldname); // Colocar aqui o nome do arquivo que vai pro S3
        // id XXXXX is from 'parecer' folder
        formData.append('folder', 42394); // Substituir id pelo id da pasta no plugsign (criar uma pasta chamada 'documentos' e pegar o id dela)
        formData.append('file', fileBuffer, { filename: 'nome_do_arquivo.pdf', contentType: 'application/pdf' });
        const headers = {
            "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
            "Accept": "*/*",
            ...formData.getHeaders()
        };
        try {
            await prisma.$transaction(async (tsPrisma) => {

                const uploadDocument = await axios.post('https://app.plugsign.com.br/api/files/upload', formData, {
                    headers: headers,
                    timeout: 200000,
                });
                if (uploadDocument.status !== 200 && !uploadDocument.data?.data?.document_key) {
                    console.log("Erro aqui");
                    throw new Error("Erro ao enviar arquivo para assinatura");
                }

                const documentKey = <string>uploadDocument.data.data.document_key


                // Determinar rota no AWS 
                const route = `CandidateDocuments/${candidateOrResponsible.UserData.id}/${documentType}/${member_id}/${table_id ? table_id + '/' : ''}${file.fieldname.split('_')[1]}.${file.mimetype.split('/')[1]}`;
                await tsPrisma.signedDocuments.create({
                    data: {
                        documentKey: documentKey,
                        path: route,
                        emails: [member.email, ...emails],
                        metadata: file.metadata,

                    }
                })
                const emailBody = {
                    email: [member.email, ...emails],
                    document_key: documentKey,
                    message: `Documento para assinatura`,
                    width_page: "1000",
                    fields: [
                        [{ page: lastPage, type: "image", width: 200, height: 75, xPos: -999, yPos: -999 }],
                    ]

                }
                const sendEmail = await axios.post('https://app.plugsign.com.br/api/requests/documents', emailBody, {
                    headers
                });
                if (sendEmail.status !== 200) {
                    throw new Error("Erro ao enviar email para assinatura")
                }
            })
        } catch (e: any) {
            if (e.response) {
                // Acesso à resposta do erro
                console.log("Erro ao fazer upload do documento:", e.response.status);
                console.log("Detalhes do erro:", e.response.data);
            } else {
                console.log("Erro ao fazer a requisição:", e);
            }
        }

        return reply.status(200).send({ message: "Documento enviado para assinatura com sucesso" })

    } catch (error: any) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })

        }
        if (error instanceof FileNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        if (error instanceof Error) {
            return reply.status(405).send({ message: error.message })

        }
        return reply.status(500).send({ message: error.message })
    }
}

async function countPdfPages(file: Buffer): Promise<number> {
    const pdfDoc = await PDFDocument.load(file);
    return pdfDoc.getPageCount();
}