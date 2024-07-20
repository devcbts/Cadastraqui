import { ForbiddenError } from "@/errors/forbidden-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import axios from 'axios';
import FormData from 'form-data';
import { FileNotFoundError } from "@/errors/file-not-found";
import { env } from "@/env";
import { PDFDocument } from 'pdf-lib';
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";



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
            include: { candidate: true ,
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
        const formData = new FormData();
        formData.append('name', application_id);
        formData.append('file', file);
        const headers = {
            "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
        };
        const uploadDocument = await axios.post('https://app.plugsign.com.br/api/files/upload', formData, {
            headers
        });

        if (uploadDocument.status !== 200 && !uploadDocument.data.document_key) {
            throw new Error("Erro ao enviar arquivo para assinatura")
        }
        const documentKey = <string>uploadDocument.data.document_key

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
                [{ page: lastPage, type: "image", width: 200, height: 75, xPos: 400, yPos: 600 }]
            ]

        }
        const sendEmail = await axios.post('https://app.plugsign.com.br/api/requests/documents', emailBody, {
            headers
        });

        if (sendEmail.status !== 200) {
            throw new Error("Erro ao enviar email para assinatura")
        }

        return reply.status(200).send({ message: "Documento enviado para assinatura com sucesso" })

    } catch (error) {
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
    }
}

async function countPdfPages(file: Buffer): Promise<number> {
    const pdfDoc = await PDFDocument.load(file);
    return pdfDoc.getPageCount();
}