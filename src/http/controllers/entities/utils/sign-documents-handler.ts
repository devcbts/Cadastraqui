import { APIError } from "@/errors/api-error";
import { EntityDocuments, EntityDocumentType, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import axios from "axios";
import FormData from 'form-data';
import { PDFDocument } from "pdf-lib";
import { env } from "process";

export default async function signDocumentsHandler({
    type,
    file,
    metadata = {},
    userId,
    path,
    db,
    doc
}: {
    type?: EntityDocumentType,
    file?: { name?: string, buffer?: Buffer },
    metadata?: any,
    userId: string,
    path: string,
    db: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    doc?: EntityDocuments

}): Promise<string | undefined> {
    let currDocType = type
    if (!file || !file.buffer) {
        return undefined
    }
    if (!type && doc) {
        currDocType = doc?.type
    }
    switch (currDocType) {
        case 'MONTHLY_REPORT':
            const pdfDoc = await PDFDocument.load(file.buffer);
            const lastPage = pdfDoc.getPageCount();

            const formData = new FormData()
            formData.append("name", file.name)
            formData.append("folder", 106547)
            formData.append("file", file.buffer, { filename: file.name })
            const plug_api = 'https://app.plugsign.com.br/api'
            const api = axios.create({
                baseURL: plug_api, headers: {
                    "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
                    "Content-Type": "multipart/formdata",
                    "Accept": "*/*",
                }
            })
            if (doc) {
                const response = await api.get('/docs', {
                    params: {
                        document_key: doc.signKey
                    }
                })
                if (response.data?.data?.length === 1) {
                    await api.delete('/docs', { data: { id: response.data.data[0].id } })
                }
            }
            const uploadDocument = await api.post('/files/upload', formData, {
                timeout: 200000,
            });
            if (uploadDocument.status !== 200 && !uploadDocument.data?.data?.document_key) {
                throw new APIError("Erro ao enviar arquivo para assinatura");
            }

            const documentKey = <string>uploadDocument.data.data.document_key
            console.log(documentKey)
            await db.signedDocuments.create({
                data: {
                    documentKey,
                    path: path,
                    metadata: metadata as Prisma.InputJsonValue,
                }
            })
            const userEmail = await db.user.findUnique({
                where: { id: userId }, select: { email: true }
            })
            const emailBody = {
                email: ["gabriel_campista@hotmail.com"],
                document_key: documentKey,
                message: `Documento de Relatório de Monitoramento para assinar`,
                width_page: "1000",
                fields: [
                    [{ page: lastPage, type: "image", width: 200, height: 75, xPos: -999, yPos: -999 }],
                ]

            }
            await api.post('requests/documents', emailBody);
            return documentKey

        default:
            return undefined
            break;
    }
}