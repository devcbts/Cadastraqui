import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function updateSocialAssistant(
    request: FastifyRequest,
    response: FastifyReply
) {

    const bodySchema = z.object({
        assistant_id: z.string(),
        name: z.string().optional(),
        CPF: z.string().optional(),
        email: z.string().email().optional(),
        RG: z.string().optional(),
        CRESS: z.string().optional(),
        phone: z.string().optional(),
    })
    const { assistant_id, ...parsedSchema } = bodySchema.parse(request.body)
    try {
        // check assistant and entity
        const { sub } = request.user
        const a = await prisma.entity.findUnique({
            where: { user_id: sub },
            include: {
                SocialAssistant: {
                    where: {
                        id: assistant_id
                    }
                }
            }
        })
        if (!a || !a.SocialAssistant) {
            console.log(a)
            throw Error('Entidade ou assistente não encontrados')
        }
        const checkUserEmail = await prisma.user.findFirst({
            where: { AND: [{ email: { equals: parsedSchema.email } }, { id: { not: assistant_id } }] }
        })
        if (checkUserEmail) {
            return response.status(400).send({ message: "Email já cadastrado" })
        }
        const checkAssistantCPF = await prisma.socialAssistant.findFirst({
            where: { AND: [{ CPF: parsedSchema.CPF }, { user_id: { not: assistant_id } }] }
        })

        if (checkAssistantCPF) {
            return response.status(400).send({ message: "CPF já cadastrado" })
        }

        const { email, ...dataToUpdate } = parsedSchema
        await prisma.socialAssistant.update({
            where: { user_id: assistant_id },
            data: {
                ...dataToUpdate,
                user: {
                    update: {
                        where: { id: assistant_id },
                        data: {
                            email: email
                        }
                    }
                }
            }
        })
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: 'Erro ao atualizar assistente' })
    }
}