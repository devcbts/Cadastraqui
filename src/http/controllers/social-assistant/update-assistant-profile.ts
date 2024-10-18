import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
export default async function updateAssistantProfile(
    request: FastifyRequest,
    response: FastifyReply
) {
    const updateAssistantProfileSchema = z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        CRESS: z.string().optional(),
        CPF: z.string().transform(e => e.replace(/\D*/g, '')).optional(),
        phone: z.string().optional(),
    })
    const parsedSchema = updateAssistantProfileSchema.parse(request.body)
    try {
        const { sub } = request.user
        // Verify if user is the same/existing accounts using equal email or CNPJ
        const checkUserEmail = await prisma.user.findFirst({
            where: { AND: [{ email: { equals: parsedSchema.email } }, { id: { not: sub } }] }
        })
        if (checkUserEmail) {
            return response.status(400).send({ message: "Email já cadastrado" })
        }
        const checkAssistantCPF = await prisma.socialAssistant.findFirst({
            where: { AND: [{ CPF: parsedSchema.CPF }, { user_id: { not: sub } }] }
        })

        if (checkAssistantCPF) {
            return response.status(400).send({ message: "CPF já cadastrado" })
        }

        const { email, ...dataToUpdate } = parsedSchema
        await prisma.socialAssistant.update({
            where: { user_id: sub },
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