import { prisma } from "@/lib/prisma";
import { calculateAge } from "@/utils/calculate-age";
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible';
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
import { ForbiddenError } from '../../../errors/forbidden-error';
export default async function deleteFamilyMember(
    request: FastifyRequest,
    response: FastifyReply
) {
    const deleteFamilyMemberSchema = z.object({
        id: z.string()
    })

    const { id } = deleteFamilyMemberSchema.parse(request.query)

    try {

        const user_id = request.user.sub
        const candidateOrReponsible = await SelectCandidateResponsible(user_id)
        if (!candidateOrReponsible) {
            throw new ForbiddenError()
        }

        const member = await prisma.familyMember.findUnique({
            where: { id }
        })
        if (!member) {
            return response.status(400).send({ message: "Membro da família não encontrado" })
        }
        if (![member.legalResponsibleId, member.candidate_id].includes(candidateOrReponsible.UserData.id)) {
            throw new ForbiddenError()

        }
        if (candidateOrReponsible.IsResponsible && calculateAge(member.birthDate) < 18) {
            const legalDependent = await prisma.candidate.findFirst({
                where: { name: member.fullName, CPF: member.CPF, birthDate: member.birthDate, responsible_id: candidateOrReponsible.UserData.id }
            })
            if (!legalDependent) {
                return response.status(400).send({ message: "Dependente legal não encontrado" })

            }
            await prisma.candidate.delete({
                where: { id: legalDependent.id }
            })
        }
        await prisma.familyMember.delete({
            where: { id }
        })
        await prisma.deletedFamilyMembers.create({
            data: {
                familyMember_id: id,
                candidateOrResponsibleId: candidateOrReponsible.UserData.id,
            }
        })
        return response.status(204).send()
    }
    catch (err) {
        console.log(err)
        if (err instanceof ForbiddenError) {
            return response.status(403).send({ message: err.message })
        }
    }
}