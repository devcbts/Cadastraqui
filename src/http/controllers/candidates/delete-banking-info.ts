
import { ForbiddenError } from "@/errors/forbidden-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function deleteBankingInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const BankingInfoParamsSchema = z.object({
        id: z.string(),
    })

    console.log(request.params)
    // _id === bankAccount_id
    const { id } = BankingInfoParamsSchema.parse(request.params)
    try {
        const user_id = request.user.sub
        const candidateOrResponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
        }

        // Atualiza informações acerca do Banking Info no banco de dados
        await prisma.bankAccount.delete({
            where: { id: id },
        })

        //TODO: remove all documents associated with the current bank account information
        return reply.status(204).send()
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof NotAllowedError) {
            return reply.status(401).send({ message: err.message })
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })

        }

        return reply.status(500).send({ message: err.message })
    }
}