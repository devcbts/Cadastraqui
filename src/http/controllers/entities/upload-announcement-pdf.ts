import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
export async function uploadAnnouncementPdf(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const uploadParamsSchema = z.object({
        announcement_id: z.string()
    })

    const { announcement_id } = uploadParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub
        // Verifica se existe um candidato associado ao user_id
        const role = request.user.role
        if (role !== 'ENTITY') {
            throw new NotAllowedError()
        }

        const entity = await prisma.entity.findUnique({ where: { user_id } })
        if (!entity) {
            throw new ResourceNotFoundError()
        }

        const data = await request.file();
        if (!data) {
            throw new ResourceNotFoundError()
        }
        const fileBuffer = await data.toBuffer();
        console.log(fileBuffer.length)
        const Route = `Announcemenets/${entity.id}/${announcement_id}`
        const sended = await uploadFile(fileBuffer, Route)

        if (!sended) {

            throw new NotAllowedError()
        }





        reply.status(201).send()
    } catch (error) {
        if (error instanceof NotAllowedError) {
            return reply.status(401).send()
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send()
        }
        return reply.status(500).send()
    }
}
