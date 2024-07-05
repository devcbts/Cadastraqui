import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { getSectionDocumentsPDF_HDB } from "../AWS-routes/get-documents-by-section-HDB"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { prisma } from "@/lib/prisma"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { ForbiddenError } from "@/errors/forbidden-error"

export async function getDeclarationsPDF(request: FastifyRequest, reply: FastifyReply) {
    const DeclarationParamsSchema = z.object({
        application_id: z.string(),
    })

    const { application_id } = DeclarationParamsSchema.parse(request.params)

    try {
        
        const user_id = request.user.sub
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: {user_id}
        })
        if (!isAssistant) {
            throw new ForbiddenError()
            
        }
        const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id);
        if (!candidateOrResponsibleHDB) {
            throw new ResourceNotFoundError()
            
        }
        const url = await getSectionDocumentsPDF_HDB(application_id, 'declaracoes')

        const declaration = {
            name: candidateOrResponsibleHDB.UserData.name,
            id: candidateOrResponsibleHDB.UserData.id,
            url: url
        }

        return reply.status(200).send({ declaration })
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}