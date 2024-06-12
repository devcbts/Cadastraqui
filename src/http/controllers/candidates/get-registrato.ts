import { ForbiddenError } from "@/errors/forbidden-error";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getSectionDocumentsPDF } from "./AWS Routes/get-pdf-documents-by-section";

export async function getRegistrato(
    request: FastifyRequest,
    reply: FastifyReply,
){
    const registrateParamsSchema = z.object({
        _id: z.string(),
    })
    const {_id} = registrateParamsSchema.parse(request.params)
    try {
        const user_id = request.user.sub;
        
        const isUser = await SelectCandidateResponsible(user_id);
        if (!isUser) {
            throw new ForbiddenError()
        }
        const urls = await getSectionDocumentsPDF(isUser.UserData.id, `registrato/${_id}`)
        return reply.status(200).send(urls)
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({message: error.message})
        }
    }
}