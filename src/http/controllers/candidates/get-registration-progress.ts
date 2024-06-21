import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getRegistrationProgress(request: FastifyRequest,
    reply: FastifyReply,
) {

    try {
        const user_id = request.user.sub;
        const candidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!candidateOrResponsible) {
            throw new ForbiddenError();
        }
        let idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }

        const progress = await prisma.finishedRegistration.findFirst({
            where: idField,
        })
        console.log(progress)
        return reply.status(200).send(progress);
    } catch (error) {
        if (error instanceof ForbiddenError) {

            return reply.status(403).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal Server Error' });
    }
}