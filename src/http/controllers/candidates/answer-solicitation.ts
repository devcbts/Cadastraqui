import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { prisma } from "@/lib/prisma";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function answerSolicitation(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const paramsSchema = z.object({
        solicitation_id: z.string(),
    });
    const { solicitation_id } = paramsSchema.parse(request.body);

    try {
        const user_id = request.user.sub;
        const CandidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!CandidateOrResponsible) {
            throw new ForbiddenError();
        }

        const solicitation = await prisma.applicationHistory.findUnique({
            where: { id: solicitation_id },
            include: {
                application:true
            }
        });

        if (!solicitation) {
            throw new  ResourceNotFoundError()
        }

        // Check if the user is allowed to answer this solicitation
        const isAllowedToAnswer = CandidateOrResponsible.IsResponsible ? solicitation.application.responsible_id === CandidateOrResponsible.UserData.id : solicitation.application.candidate_id === CandidateOrResponsible.UserData.id;
        if (!isAllowedToAnswer) {
            throw new ForbiddenError();
        }

        await prisma.applicationHistory.update({
            where: { id: solicitation_id },
            data: {
                answered: true,
            },
        });

        return reply.status(200).send({ message: "Solicitation answered successfully" });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message });
        }
        if (error instanceof ResourceNotFoundError)  {
            return reply.status(404).send({ message: error.message });
        }
        // Handle other potential errors, such as database errors
        return reply.status(500).send({ message: "An error occurred while answering the solicitation" });
    }
}