import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
// Change password function differs from reset password
// because user MUST be logged in to change, but not for resetting
export default async function changePassword(
    request: FastifyRequest,
    response: FastifyReply
) {
    const changePasswordSchema = z.object({
        oldPassword: z.string(),
        newPassword: z.string()
    })

    const { oldPassword, newPassword } = changePasswordSchema.parse(request.body)
    try {
        const { sub } = request.user
        const getCurrentUser = await prisma.user.findUnique({
            where: { id: sub }
        })
        if (!getCurrentUser) {
            return response.status(400).send({ message: "Usuário não encontrado" })
        }
        const hash_pass = await hash(oldPassword, 6)
        const comparePassword = await compare(oldPassword, getCurrentUser.password)
        console.log(oldPassword, hash_pass)
        if (!comparePassword) {
            return response.status(400).send({ message: "Senha atual incorreta" })
        }
        await prisma.user.update({
            where: { id: sub },
            data: {
                password: await hash(newPassword, 6)
            }
        })
        return response.status(204).send()
    }
    catch (err) {

    }
}