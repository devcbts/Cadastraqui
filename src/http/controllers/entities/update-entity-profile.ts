import { prisma } from "@/lib/prisma";
import STATES from "@/utils/enums/zod/state";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
export default async function updateEntityProfile(
    request: FastifyRequest,
    response: FastifyReply
) {
    const updateEntityProfileSchema = z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        CNPJ: z.string().optional(),
        CEP: z.string().optional(),
        address: z.string().optional(),
        addressNumber: z.union([z.string(), z.number()]).transform((value) => parseInt(value.toString())).optional(),
        city: z.string().optional(),
        neighborhood: z.string().optional(),
        UF: STATES.optional(),
    })
    const parsedSchema = updateEntityProfileSchema.parse(request.body)
    try {
        const { sub } = request.user
        // Verify if user is the same/existing accounts using equal email or CNPJ
        const checkUserEmail = await prisma.user.findFirst({
            where: { AND: [{ email: { equals: parsedSchema.email } }, { id: { not: sub } }] }
        })
        if (checkUserEmail) {
            return response.status(400).send({ message: "Email já cadastrado" })
        }
        const checkResponsibleCNPJ = await prisma.entity.findFirst({
            where: { AND: [{ CNPJ: parsedSchema.CNPJ }, { user_id: { not: sub } }] }
        })

        if (checkResponsibleCNPJ) {
            return response.status(400).send({ message: "CPF já cadastrado" })
        }
        const currentEntity = await prisma.entity.findUnique({
            where: { user_id: sub }
        })
        const { email, ...dataToUpdate } = parsedSchema
        await prisma.entity.update({
            where: { id: currentEntity?.id },
            data: {
                ...dataToUpdate,
                user: {
                    update: {
                        where: { id: sub },
                        data: {
                            email: email
                        }
                    }
                }
            }
        })
        return response.status(204).send()
    } catch (err) {

    }
}