import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrls } from '@/http/services/get-files'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function getSolicitationDocumentsPDF(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        solicitation_id: z.string(),
        application_id: z.string(),
    })


    const { application_id, solicitation_id } = applicationParamsSchema.parse(request.params)
    try {
        const userType = request.user.role
        const userId = request.user.sub

        // Verifica se usuário é assistente


        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId },
        })

        // Verifica se o usuário existe na tabela de assistentes
        if (!assistant) {
            throw new NotAllowedError()
        }


        // Encontrar a solicitação
        const solicitation = await prisma.requests.findUnique({
            where: { id: solicitation_id }
        })

        if (!solicitation) {
            throw new ResourceNotFoundError()
        }


        // Encontrar a inscrição
        const application = await prisma.application.findUnique({
            where: { id: application_id }
        })

        if (!application) {
            throw new ResourceNotFoundError()
        }

        // verifica se existe o processo seletivo
        const announcement = await prisma.announcement.findUnique({
            where: { id: application.announcement_id }
        })

        if (announcement) {
            // verifica se o processo seletivo é da mesma entidade do assistente
            if (announcement.entity_id !== assistant.entity_id) {
                throw new NotAllowedError();
            }

            // Pegar os links na pasta que os documentos foram upados

            const Folder = `SolicitationDocuments/${application.id}/${solicitation_id}`

            const urls = await GetUrls(Folder)

            return reply.status(200).send({ urls })

        } else {
            throw new AnnouncementNotExists();
        }



    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: err.message })
    }
}
