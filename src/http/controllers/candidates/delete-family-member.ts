import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
export default async function deleteFamilyMember(
    request: FastifyRequest,
    response: FastifyReply
) {
    const deleteFamilyMemberSchema = z.object({
        id: z.string()
    })

    const { id } = deleteFamilyMemberSchema.parse(request.query)

    try {
        const member = await prisma.familyMember.findUnique({
            where: { id }
        })
        if (!member) {
            return response.status(400).send({ message: "Membro da família não encontrado" })
        }
        await prisma.familyMember.delete({
            where: { id }
        })
        return response.status(204).send()
    }
    catch (err) {

    }
}