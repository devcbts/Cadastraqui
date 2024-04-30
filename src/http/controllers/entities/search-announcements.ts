import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
export default async function searchAnnouncements(
    request: FastifyRequest,
    response: FastifyReply
) {
    /*
    If id is passed - Only announcements from certain entity
    Filter can be anything (announcement name, entity name, ...)
    In case id is UNDEFINED, it'll return the 10 first results from the specified filter
    */

    const searchAnnouncementSchema = z.object({
        id: z.string().optional(),
        filter: z.string().optional(),
        open: z.boolean().default(true),
        page: z.number().default(1),
        itemCount: z.number().default(10)
    })
    try {
        const { id, filter, page, itemCount, open } = searchAnnouncementSchema.parse(request.body)
        const currentDate = new Date()
        const announcements = await prisma.announcement.findMany({
            where: {
                entity: { id },
                AND: [
                    open ? {
                        AND: [
                            { announcementBegin: { lte: currentDate } },
                            { announcementDate: { gte: currentDate } }
                        ]
                    } : {
                        announcementDate: { lt: currentDate }
                    },
                    {
                        OR: [
                            { announcementName: { contains: filter, mode: "insensitive" } },
                            { entity: { name: { contains: filter, mode: "insensitive" } } },
                            { entity_subsidiary: { some: { name: { contains: filter, mode: "insensitive" } } } },
                        ]
                    }
                ]

            },
            skip: (page! - 1) * itemCount!,
            take: itemCount!
        })
        return response.status(200).send({
            announcements
        })
    } catch (err) {
        console.log(err)
    }
}