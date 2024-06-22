import { ForbiddenError } from "@/errors/forbidden-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getSectionDocumentsPDF_HDB } from "../AWS-routes/get-documents-by-section-HDB";

export async function getRegistratoHDB(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const registrateParamsSchema = z.object({
        application_id: z.string(),
        _id: z.string(),
    })
    const { application_id, _id } = registrateParamsSchema.parse(request.params)
    try {
        // const user_id = request.user.sub;

        // const isUser = await SelectCandidateResponsible(user_id);
        // if (!isUser) {
        //     throw new ForbiddenError()
        // }
        const urls = await getSectionDocumentsPDF_HDB(application_id, `registrato/${_id}`)
        return reply.status(200).send(urls)
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
    }
}