import { env } from "@/env";
import { FileNotFoundError } from "@/errors/file-not-found";
import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import axios from 'axios';
import { FastifyReply, FastifyRequest } from "fastify";
import FormData from 'form-data';
import { PDFDocument } from 'pdf-lib';
import { z } from "zod";



export async function sendParecerDocumentToSign(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const parecerParams = z.object({
        application_id: z.string(),
    })

    const { application_id } = parecerParams.parse(request.params)
    try {
        const user_id = request.user.sub
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id },
            include: {
                user: true
            }
        })
        if (!isAssistant) {
            throw new ForbiddenError()

        }

        const application = await prisma.application.findUnique({
            where: { id: application_id },
            include: {
                candidate: true,
                announcement: true
            }
        })

        if (!application) {
            throw new ResourceNotFoundError()
        }
        const file = await request.file();
        if (!file) {
            throw new FileNotFoundError()
        }
        const fileBuffer = await file.toBuffer();
        const lastPage = await countPdfPages(fileBuffer)
        const fileBufferBase64 = fileBuffer.toString('base64');
        const formData = new FormData();
        formData.append('name', application_id);
        // id 42394 is from 'parecer' folder
        formData.append('folder', 42394);
        formData.append('file', fileBuffer, { filename: 'nome_do_arquivo.pdf', contentType: 'application/pdf' });
        const headers = {
            "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
            "Accept": "*/*",
            ...formData.getHeaders()
        };
        try {
            const uploadDocument = await axios.post('https://app.plugsign.com.br/api/files/upload', formData, {
                headers: headers,
                timeout: 200000,
            });
            if (uploadDocument.status !== 200 && !uploadDocument.data?.data?.document_key) {
                console.log("Erro aqui");
                throw new Error("Erro ao enviar arquivo para assinatura");
            }

            const documentKey = <string>uploadDocument.data.data.document_key

            await prisma.application.update({
                where: { id: application_id },
                data: {
                    parecerDocumentKey: documentKey
                }
            })

            const emailBody = {
                email: [isAssistant.user.email],
                document_key: documentKey,
                message: `Documento do parecer do candidato ${application.candidate.name} na inscrição número ${application.number}, do edital ${application.announcement.announcementName} `,
                width_page: "1000",
                fields: [
                    [{ page: lastPage, type: "image", width: 200, height: 75, xPos: -999, yPos: -999 }],
                ]

            }
            console.log(emailBody)
            const sendEmail = await axios.post('https://app.plugsign.com.br/api/requests/documents', emailBody, {
                headers
            });
            console.log(sendEmail.data)
            if (sendEmail.status !== 200) {
                throw new Error("Erro ao enviar email para assinatura")
            }
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