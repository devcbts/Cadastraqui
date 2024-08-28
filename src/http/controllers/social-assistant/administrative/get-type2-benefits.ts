import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getType2Benefits(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestParamsSchema = z.object({
        scholarship_id: z.string(),
        application_id: z.string()
    })

    const { scholarship_id, application_id } = requestParamsSchema.parse(request.params)
    try {

        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
        if (!candidateOrResponsible) {
            throw new ForbiddenError()
            
        }
        const type2Benefits = await prisma.type2Benefit.findMany({
            where: {
                scholarshipGrantedId: scholarship_id
            },
        })


        const members = await historyDatabase.familyMember.findMany({
            where: {application_id}
        })

        const candidate = await historyDatabase.candidate.findUnique({
            where: { application_id }
        })

        if (!candidate) {
            throw new ResourceNotFoundError()
        }

        const formatedMembers = members.map(member => {
            return {
                id: member.id,
                name: member.fullName,
                CPF: member.CPF,
                relationship: member.relationship,
                profession: member.profession,
                isCandidate: member.CPF === candidate.CPF
            }
        })

        const identityDetails = await historyDatabase.identityDetails.findUnique({
            where: {application_id}
        })
        if (!identityDetails) {
            throw new ResourceNotFoundError()

        }
        const cadastrante = {
            id: identityDetails.id,
            name: identityDetails.fullName,
            CPF: identityDetails.CPF,
            profession: identityDetails.profession,
            isCandidate: identityDetails.CPF === candidate.CPF
        }
           
        return reply.status(200).send({ type2Benefits, cadastrante, formatedMembers })
    } catch (error) {

        return reply.status(500).send({ message: 'Internal server error', error })
    }
}