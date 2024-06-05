import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getAvailableApplicants(
    request: FastifyRequest,
    response: FastifyReply
) {
    try {
        const id = request.user.sub
        const user = await SelectCandidateResponsible(id)
        const { id: user_id } = user?.UserData
        let applicants;
        if (user?.IsResponsible) {
            applicants = await prisma.candidate.findMany({
                where: { responsible_id: user_id }
            })
        } else {
            applicants = await prisma.candidate.findUnique({
                where: { id: user_id }
            })
        }
        return response.status(200).send({ applicants })
    } catch (err) {
        return response.status(500).send()
    }
}