import { ForbiddenError } from "@/errors/forbidden-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function deleteIncomeInfo(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const incomeParamsSchema = z.object({
        income_id: z.string(),
        member_id: z.string(),
    })

    const { income_id, member_id } = incomeParamsSchema.parse(request.params)

    try {
        const user_id = request.user.sub
        const IsUser = await SelectCandidateResponsible(user_id)
        if (!IsUser) {
            throw new NotAllowedError()
        }
       
        const findIncome = await prisma.familyMemberIncome.findUnique({
            where: {id: income_id},
        })
        if (!findIncome) {
            throw new ResourceNotFoundError()
        }
        const user_owner = findIncome.candidate_id || findIncome.legalResponsibleId || findIncome.familyMember_id
        
        if (user_owner !== member_id) {
            throw new ForbiddenError()
        }
        const income = await prisma.familyMemberIncome.delete({
            where: {
              id: income_id,
            },
        })
        await prisma.monthlyIncome.deleteMany({
            where:{
                incomeSource: income.employmentType,
                OR:[{familyMember_id:member_id},{candidate_id:member_id},{legalResponsibleId:member_id}]
            }
        })
        return reply.status(204).send()
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}