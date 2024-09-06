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



export async function resendMemberEmailDocumentToSign(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const parecerParams = z.object({
        member_id: z.string(),
        declaration_id: z.string(),
    })

    const { declaration_id,member_id } = parecerParams.parse(request.params)
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
        try {

                const declaration = await prisma.declarations.findUniqueOrThrow({
                    where: { id: declaration_id }
                })
                const emailBody = {
                    email: [member.email],
                    document_key: declaration.documentKey,
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