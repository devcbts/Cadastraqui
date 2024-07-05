import { prisma } from "@/lib/prisma";
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
        let result;
        if (user.IsResponsible) {
            result = await prisma.legalResponsible.findUnique({
                where: { id: user.UserData.id },
                include: {
                    Candidate: {
                        include: {
                            Vehicle: true,
                            BankAccount: true,
                            IdentityDetails: true
                        }
                    },
                    Vehicle: true,
                    BankAccount: true,
                    IdentityDetails: true
                }
            })
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
        return response.status(200).send({ userInfo: result })
    } catch (err) {
        return response.status(400).send({ message: err })
    }
}