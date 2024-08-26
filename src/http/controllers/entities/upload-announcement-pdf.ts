import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { uploadFile } from '@/http/services/upload-file'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import SelectEntityOrDirector from './utils/select-entity-or-director'
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
        const role = request.user.role

        const entity = await SelectEntityOrDirector(user_id, role)

        const data = await request.file();
        if (!data) {
            throw new ResourceNotFoundError()
        }
        const fileBuffer = await data.toBuffer();
        console.log(fileBuffer.length)
        const Route = `Announcements/${entity.id}/${announcement_id}.pdf`
        const sended = await uploadFile(fileBuffer, Route)

        if (!sended) {

            throw new NotAllowedError()
        }





        reply.status(201).send()
    } catch (error) {
        console.log(error)
        if (error instanceof NotAllowedError) {
            return reply.status(401).send()
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send()
        }
        return reply.status(500).send()
    }
}
