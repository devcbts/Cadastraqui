import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { getAwsFile } from "@/lib/S3";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export default async function getCandidateSubscriptionDocuments(request: FastifyRequest, reply: FastifyReply) {
    const candidateParams = z.object({
        candidate_id: z.string()
    })

    const { candidate_id } = candidateParams.parse(request.params)
    try {
        const candidate = await SelectCandidateResponsible(candidate_id)

        if (!candidate) {
            throw new ResourceNotFoundError()

        }

        const { id } = candidate.UserData
        const identityDetails = await prisma.identityDetails.findFirst({
            where: { OR: [{ candidate_id: id }, { responsible_id: id }] }
        })
        if (!identityDetails) {
            throw new ResourceNotFoundError()

        }
        const familyMembers = await prisma.familyMember.findMany({
            where: { OR: [{ candidate_id: id }, { legalResponsibleId: id }] }
        })



        const membersNames = familyMembers.map((member) => {
            return {

                id: member.id,
                name: member.fullName
            }
        }
        )

        membersNames.push({ id: id, name: identityDetails.fullName })

        const documentsFilteredByMember = await Promise.all(membersNames.map(async member => {
            const documents = await prisma.candidateDocuments.findMany({
                where: { memberId: member.id }
            })
            const mappedDocs = await Promise.all(documents.map(async doc => {
                const url = await getAwsFile(doc.path)
                return ({ ...doc, url: url.fileUrl })
            }))

            return { member: member.name, documents: mappedDocs };
        }))

        return reply.status(200).send({ documents: documentsFilteredByMember })
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })

        }
        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}