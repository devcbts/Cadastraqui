import { prisma } from "@/lib/prisma";
import { getSignedUrlForFile } from "@/lib/S3";
import { calculateAge } from "@/utils/calculate-age";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import verifyDeclarationRegistration from "@/utils/Trigger-Functions/verify-declaration-registration";
import { FamilyMember } from "@prisma/client";
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
        await verifyDeclarationRegistration(user.UserData.id)
        let result: any;
        const url = await getSignedUrlForFile(`CandidateDocuments/${user.UserData.id}/declaracoes/${user.UserData.id}/declaracoes.pdf`)
        console.log(url)
        if (user.IsResponsible) {
            result = await prisma.legalResponsible.findUnique({
                where: { id: user.UserData.id },
                include: {
                    FamillyMember: {
                        include: {
                            BankAccount: true
                        }
                    },
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
            // NOT USED: LEGAL DEPENDANTS OF RESPONSIBLE (COMMENTED IN CASE WE NEED IN THE FUTURE)

            // Legal dependents are 'copies' of a family member, so each candidate need to have it's own
            // identity details to fit all declarations

            const mappedCandidates = await Promise.all(result?.Candidate.map(async (candidate: any) => {
                const fm = await prisma.familyMember.findFirst({
                    where: { AND: [{ legalResponsibleId: result.id }, { CPF: candidate.CPF }] }
                })
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
                    FamillyMember: {
                        include: {
                            BankAccount: true
                        }
                    },
                    Vehicle: true,
                    BankAccount: true,
                    IdentityDetails: true
                }
            })
        }
        const mappedFamilyMember = async () => {
            const list = await Promise.all(result.FamillyMember
                .filter((e: FamilyMember) => calculateAge(e.birthDate) >= 18)
                .map(async (e: FamilyMember) => {
                    const url = await getSignedUrlForFile(`CandidateDocuments/${user.UserData.id}/declaracoes/${e.id}/declaracoes.pdf`)

                    return {
                        ...e,
                        Candidate: result.Candidate,
                        name: e.fullName, IdentityDetails: {
                            ...e,
                            address: result.IdentityDetails.address,
                            neighborhood: result.IdentityDetails.neighborhood,
                            addressNumber: result.IdentityDetails.addressNumber,
                            CEP: result.IdentityDetails.CEP,
                            city: result.IdentityDetails.city,
                            UF: result.IdentityDetails.UF,
                        },
                        Vehicle: result.Vehicle,
                        lastDeclaration: url
                    }
                }))
            return list
        }
        const members = await mappedFamilyMember()
        return response.status(200).send({
            userInfo: {
                ...result,
                FamilyMember: members,
                lastDeclaration: url
            }
        })
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}