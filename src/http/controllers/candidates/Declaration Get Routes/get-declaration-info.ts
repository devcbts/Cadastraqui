import { prisma } from "@/lib/prisma";
import { getSignedUrlForFile } from "@/lib/S3";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getUserInformationForDeclaration(
    request: FastifyRequest,
    response: FastifyReply
) {

    try {
        const { sub } = request.user
        const user = await SelectCandidateResponsible(sub)
        if (!user) {
            throw new Error('Usuário não encontrado')
        }
        let result: any;
        const url = await getSignedUrlForFile(`CandidateDocuments/${user.UserData.id}/declaracoes/${user.UserData.id}/declaracoes.pdf`)
        console.log(url)
        if (user.IsResponsible) {
            result = await prisma.legalResponsible.findUnique({
                where: { id: user.UserData.id },
                include: {
                    Candidate: {
                        include: {
                            Vehicle: true,
                            BankAccount: true,
                        }
                    },
                    Vehicle: { include: { FamilyMemberToVehicle: true } },
                    BankAccount: true,
                    IdentityDetails: true
                }
            })
            // Legal dependents are 'copies' of a family member, so each candidate need to have it's own
            // identity details to fit all declarations
            const mappedCandidates = await Promise.all(result?.Candidate.map(async (candidate: any) => {
                const fm = await prisma.familyMember.findFirst({
                    where: { AND: [{ legalResponsibleId: result.id }, { fullName: candidate.fullName }] }
                })
                const url = await getSignedUrlForFile(`CandidateDocuments/${user.UserData.id}/declaracoes/${fm?.id}/declaracoes.pdf`)
                let identity: any = fm
                if (result.IdentityDetails) {
                    const { address, addressNumber, neighborhood, city, UF, CEP } = result.IdentityDetails
                    identity = { ...identity, address, addressNumber, neighborhood, city, UF, CEP }
                }
                return { ...candidate, IdentityDetails: identity, lastDeclaration: url }
            }) as [])
            if (result?.Candidate) {
                result.Candidate = mappedCandidates
            }
        } else {
            result = await prisma.candidate.findUnique({
                where: { id: user.UserData.id },
                include: {
                    Vehicle: true,
                    BankAccount: true,
                    IdentityDetails: true
                }
            })
        }
        return response.status(200).send({ userInfo: { ...result, lastDeclaration: url } })
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}