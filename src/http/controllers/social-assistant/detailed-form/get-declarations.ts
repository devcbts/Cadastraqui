import { ForbiddenError } from "@/errors/forbidden-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { historyDatabase, prisma } from "@/lib/prisma"
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { getSectionDocumentsPDF_HDB } from "../AWS-routes/get-documents-by-section-HDB"

export async function getDeclarationsPDF(request: FastifyRequest, reply: FastifyReply) {
    const DeclarationParamsSchema = z.object({
        application_id: z.string(),
    })

    const { application_id } = DeclarationParamsSchema.parse(request.params)

    try {

        const user_id = request.user.sub
        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id },
        })
        if (!isAssistant) {
            throw new ForbiddenError()

        }
        const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id);
        if (!candidateOrResponsibleHDB) {
            throw new ResourceNotFoundError()

        }
        if (!candidateOrResponsibleHDB.IsResponsible) {
            const url = await getSectionDocumentsPDF_HDB(application_id, `declaracoes/${candidateOrResponsibleHDB.UserData.id}`)
            const declarations = [{
                name: candidateOrResponsibleHDB.UserData.name,
                id: candidateOrResponsibleHDB.UserData.id,
                url: url
            }]
            return reply.status(200).send({ declarations })
        } else {
            const responsible = await historyDatabase.legalResponsible.findUnique({
                where: { id: candidateOrResponsibleHDB.UserData.id },
                include: {
                    Candidate: true
                }
            })
            if (!responsible) {
                throw new Error('Dados não encontrados')
            }
            const declarations = await Promise.all([
                {
                    name: responsible?.name,
                    id: responsible?.id,
                    url: await getSectionDocumentsPDF_HDB(application_id, `declaracoes/${responsible.id}`)
                },
                ...responsible.Candidate.map(async candidate => ({
                    name: candidate.name,
                    id: candidate.id,
                    url: await getSectionDocumentsPDF_HDB(application_id, `declaracoes/${candidate.id}`)
                }))
            ])
            return reply.status(200).send({ declarations })
        }


    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message })
        }

        return reply.status(500).send({ message: 'Erro interno no servidor' })
    }
}