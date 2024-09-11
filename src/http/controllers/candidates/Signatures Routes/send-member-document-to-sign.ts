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



export async function sendMemberDocumentToSign(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const parecerParams = z.object({
        member_id: z.string(),
        type: Declaration_Type
    })

    const { member_id, type } = parecerParams.parse(request.params)
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
        const idField = candidateOrResponsible.UserData.id === member_id ? { familyMember_id: member_id } : candidateOrResponsible.IsResponsible ? { legalResponsibleId: member_id } : { candidate_id: member_id }

        const file = await request.file();
        if (!file) {
            throw new FileNotFoundError()
        }
        const fileBuffer = await file.toBuffer();
        const lastPage = await countPdfPages(fileBuffer)
        const formData = new FormData();
        formData.append('name', file.fieldname); // Colocar aqui o nome do arquivo que vai pro S3
        // id XXXXX is from 'parecer' folder
        formData.append('folder', 53501); // Substituir id pelo id da pasta no plugsign (criar uma pasta chamada declaracoes)
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
                await tsPrisma.declarations.updateMany({
                    where: {
                        ...idField,
                        declarationType: type
                    },
                    data: {
                        documentKey: documentKey,

                    }
                })
                const emailBody = {
                    email: [member.email],
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