import { APIError } from "@/errors/api-error";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function createLawyer(req: FastifyRequest, res: FastifyReply) {
    try {
        const { sub } = req.user
        const schema = z.object({
            name: z.string(),
            CPF: z.string(),
            password: z.string(),
            email: z.string().email(),
        })
        const { success, error, data } = schema.safeParse(req.body)
        if (!success) {
            throw new APIError(error.issues.map(x => x.message).join('.\/n'))
        }
        const entity = await prisma.entity.findUnique({
            where: { user_id: sub }
        })
        if (!entity) {
            throw new Error('Instituição não encontrada')
        }
        await prisma.$transaction(async (prisma) => {
            const password_hash = await hash(data.password, 6)
            const user = await prisma.user.create({
                data: {
                    role: 'LAWYER',
                    email: data.email,
                    password: password_hash,

                }
            })
            await prisma.lawyer.create({
                data: {
                    CPF: data.CPF,
                    name: data.name,
                    entity_id: entity.id,
                    user_id: user.id
                }
            })
        })
        return res.status(201).send()
    } catch (err) {
        if (err instanceof APIError) {
            return res.status(400).send({
                message: err.message
            })
        }
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}