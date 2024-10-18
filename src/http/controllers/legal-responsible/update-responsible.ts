import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
export default async function updateResponsible(
    request: FastifyRequest,
    response: FastifyReply
) {
    const updateResponsibleSchema = z.object({
        name: z.string().optional(),
        email: z.string().email({ message: "Email inválido" }).optional(),
        CEP: z.string().optional(),
        CPF: z.string().transform(e => e.replace(/\D*/g, '')).optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        neighborhood: z.string().optional(),
        UF: z.enum([
            'AC',
            'AL',
            'AM',
            'AP',
            'BA',
            'CE',
            'DF',
            'ES',
            'GO',
            'MA',
            'MG',
            'MS',
            'MT',
            'PA',
            'PB',
            'PE',
            'PI',
            'PR',
            'RJ',
            'RN',
            'RO',
            'RR',
            'RS',
            'SC',
            'SE',
            'SP',
            'TO',
        ]).optional(),
        addressNumber: z.string().optional(),
    })

    try {
        const responsible = updateResponsibleSchema.parse(request.body)
        const { sub } = request.user
        const checkUserEmail = await prisma.user.findFirst({
            where: { AND: [{ email: { equals: responsible.email } }, { id: { not: sub } }] }
        })
        if (checkUserEmail) {
            return response.status(400).send({ message: "Email já cadastrado" })
        }
        const checkResponsibleCPF = await prisma.legalResponsible.findFirst({
            where: { AND: [{ CPF: responsible.CPF }, { user_id: { not: sub } }] }
        })
        if (checkResponsibleCPF) {
            return response.status(400).send({ message: "CPF já cadastrado" })
        }
        const { email, ...dataToUpdate } = responsible
        await prisma.legalResponsible.update({
            where: { user_id: sub },
            data: {
                ...dataToUpdate,
                user: {
                    update: {
                        where: { id: sub },
                        data: {
                            email: responsible.email,
                        }
                    }
                }
            },


        })
        return response.status(204).send()
    }
    catch (err: any) {
        return response.status(500).send()
    }
}