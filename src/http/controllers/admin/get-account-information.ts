import { APIError } from "@/errors/api-error";
import { GetUrl } from "@/http/services/get-file";
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getAccountInformation(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        user_id: z.string()
    })

    try {
        const { user_id } = schema.parse(request.params)
        const user = await prisma.user.findUnique({
            where: { id: user_id },
            select: {
                id: true,
                role: true,
                loginHistory: { orderBy: { createdAt: "desc" }, take: 1 },
                _count: { select: { loginHistory: true } },
                createdAt: true,
                email: true,
                isActive: true

            }
        })
        const getProfilePicture = async (id: string) => {
            return await GetUrl(`ProfilePictures/${id}`)
        }
        if (!user) {
            throw new APIError('Usuário não encontrado')
        }
        let additionalInfo = null
        let url = null;
        switch (user.role) {
            case "ENTITY":
                additionalInfo = await prisma.entity.findUnique({
                    where: { user_id: user_id },
                    select: {
                        id: true,
                        socialReason: true,
                        CNPJ: true,
                        address: true,
                        addressNumber: true,
                        city: true,
                        neighborhood: true,
                        UF: true,
                        phone: true
                    }
                })
                if (additionalInfo) {
                    url = await getProfilePicture(additionalInfo.id)
                }
                break;
            case "CANDIDATE":
                additionalInfo = await prisma.candidate.findUnique({
                    where: { user_id: user_id },
                    select: {
                        name: true,

                    }
                })
                if (additionalInfo) {
                    url = await getProfilePicture(user_id)
                }
                break;
            case "RESPONSIBLE":
                additionalInfo = await prisma.legalResponsible.findUnique({
                    where: { user_id: user_id },
                    select: {
                        name: true,

                    }
                })
                if (additionalInfo) {
                    url = await getProfilePicture(user_id)
                }

                break;
            default:
                break;
        }
        const account = {
            ...user,
            accessCount: user._count.loginHistory,
            lastAccess: user.loginHistory?.[0]?.createdAt,
            details: additionalInfo,
            picture: url
        }
        return response.status(200).send({ account })

    } catch (err) {
        if (err instanceof APIError) {
            return response.status(400).send({ message: err.message })
        }
        return response.status(500).send({ message: 'Erro interno no servidor' })
    }
}