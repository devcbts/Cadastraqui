import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { env } from "@/env";
import { ForbiddenError } from '@/errors/forbidden-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

export async function resendParecerDocumentEmail(request: FastifyRequest, reply: FastifyReply) {
    const { application_id } = request.params as { application_id: string };

    try {
        const user_id = request.user.sub;
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id },
            include: { user: true }
        });

        if (!isAssistant) {
            throw new ForbiddenError();
        }

        const application = await prisma.application.findUnique({
            where: { id: application_id },
            select: { parecerDocumentKey: true, candidate: true, announcement: true,number: true }
        });

        if (!application || !application.parecerDocumentKey) {
            throw new ResourceNotFoundError();
        }

        const emailBody = {
            email: [isAssistant.user.email],
            document_key: application.parecerDocumentKey,
            message: `Documento do parecer do candidato ${application.candidate.name} na inscrição número ${application.number}, do edital ${application.announcement.announcementName}`,
            // Adicione mais campos conforme necessário
        };

        const headers = {
            "Authorization": `Bearer ${env.PLUGSIGN_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        const sendEmail = await axios.post('https://app.plugsign.com.br/api/requests/documents', emailBody, {
            headers
        });

        if (sendEmail.status !== 200) {
            throw new Error("Erro ao reenviar email para assinatura");
        }

        return reply.status(200).send({ message: "Email reenviado com sucesso" });
    } catch (error: any) {
        // Trate os erros conforme necessário
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })

        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: error.message });
    }
}