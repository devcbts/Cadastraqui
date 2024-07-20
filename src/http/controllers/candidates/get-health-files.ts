import { NotAllowedError } from "@/errors/not-allowed-error";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getSectionDocumentsPDF } from "./AWS Routes/get-pdf-documents-by-section";

export async function getHealthFiles(
    request: FastifyRequest,
    response: FastifyReply
) {
    const schema = z.object({
        type: z.enum(['medication', 'health']),
        memberId: z.string(),
        id: z.string()
    })
    try {
        const { type, id, memberId } = schema.parse(request.params)
        const user = await SelectCandidateResponsible(request.user.sub)
        if (!user) {
            throw new NotAllowedError()
        }

        const urls = await getSectionDocumentsPDF(user.UserData.id, `${type}/${memberId}/${id}`)
        return response.status(200).send({ urls })
    } catch (err) {
        console.log(err)
        return response.status(400).send({ message: err })
    }
}