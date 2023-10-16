import { EntityNotExistsError } from "@/errors/entity-not-exists-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function patchSubsidiary(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const updateBodySchema = z.object({
        name: z.string().optional(),
        CEP: z.string().optional(),
        educationalInstitutionCode: z.string().optional(),
        socialReason: z.string().optional(),
        CNPJ: z.string().optional(),
        address: z.string().optional(),
    })

    const {
        CEP,
        CNPJ,
        address,
        name,
        socialReason,
        educationalInstitutionCode,
    } = updateBodySchema.parse(request.body)

    const updateParamsSchema = z.object({
        
        subsidiary_id: z.string(),
      })

    const {subsidiary_id} = updateParamsSchema.parse(request.params)

    try {
        const userId = request.user.sub

        if (!userId) {
            throw new NotAllowedError()
        }

        const entity = await prisma.entitySubsidiary.findUnique({
            where: { id: subsidiary_id },
        })

        if (!entity) {
            throw new EntityNotExistsError()
        }

        
        // dados para atualizar
        const dataToUpdate: Record<string, any> = {
            CEP,
            CNPJ,
            address,
            name,
            socialReason,
            educationalInstitutionCode,
        }

        // Retirar todos os dados undefined do objeto
        for (const key in dataToUpdate) {
            if (typeof dataToUpdate[key as keyof typeof dataToUpdate] === 'undefined') {
                delete dataToUpdate[key as keyof typeof dataToUpdate];
            }
        }

        await prisma.entitySubsidiary.update({
            where: { id: subsidiary_id },
            data: dataToUpdate,
        })

        return reply.status(200).send()
    } catch (err: any) {
        if (err instanceof EntityNotExistsError) {
            return reply.status(409).send({ message: err.message })
        }
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}
