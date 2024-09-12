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



export async function resendMemberEmailDocumentToSign(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const EmailBody = z.object({
        path: z.string(),
    })

    const { path } = EmailBody.parse(request.body)
    try {
    


        const signedDocument = await prisma.signedDocuments.findFirstOrThrow({
            where: { path: path },
            orderBy: { createdAt: 'desc' }
        })
        const emailBody = {
            email: signedDocument.emails,
            document_key: signedDocument.documentKey,
            message: `Documento para assinatura`,


        }
        const headers = {
            "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        const sendEmail = await axios.post('https://app.plugsign.com.br/api/requests/documents', emailBody, {
            headers
        });
        if (sendEmail.status !== 200) {
            throw new Error("Erro ao enviar email para assinatura")
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