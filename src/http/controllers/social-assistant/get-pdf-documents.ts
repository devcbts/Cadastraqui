import { ApplicationAlreadyExistsError } from '@/errors/already-exists-application-error'
import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { GetUrls } from '@/http/services/get-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function getDocumentsPDF(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        announcement_id: z.string(),
        application_id: z.string(),
    })

  
    const {announcement_id, application_id } = applicationParamsSchema.parse(request.params)
    try {
        const userType = request.user.role
        const userId = request.user.sub

        if (userType !== 'ASSISTANT') {
            throw new NotAllowedError()
        }

        const assistant = await prisma.socialAssistant.findUnique({
            where: { user_id: userId },
        })

        if (!assistant) {
            throw new NotAllowedError()
        }

        // verifica se existe o processo seletivo
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id }
        })

        if (announcement) {
            // verifica se o processo seletivo é da mesma entidade do assistente
            if (announcement.entity_id !== assistant.entity_id) {
                throw new NotAllowedError();
            }

            // Encontra a inscrição
            const application = await prisma.application.findUnique({
                where: {id: application_id}
            })
            
            const candidateId = application?.candidate_id

            const Folder = `CandidatesDocuments/${candidateId}`

            const urls = await GetUrls(Folder)

            return reply.status(200).send({message: urls})

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
