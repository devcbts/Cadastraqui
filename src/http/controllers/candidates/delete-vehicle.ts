import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function deleteVehicle(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        id: z.string()
    })
    try {
        const { id } = schema.parse(request.params)
        await prisma.vehicle.delete({
            where: {
                id: id
            }
        })
        return response.status(204).send()
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}