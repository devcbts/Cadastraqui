import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { getAwsFile } from "@/lib/S3";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getRegistrato(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const registrateParamsSchema = z.object({
        _id: z.string(),
    })
    const { _id } = registrateParamsSchema.parse(request.params)
    try {
        const user_id = request.user.sub;

        const isUser = await SelectCandidateResponsible(user_id);
        if (!isUser) {
            throw new ForbiddenError()
        }
        // const urls = await getSectionDocumentsPDF(isUser.UserData.id, `registrato/${_id}`)
        const pix = await prisma.candidateDocuments.findFirst({
            where: {
                AND: [
                    { tableName: "pix" },
                    { tableId: _id }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
        const registrato = await prisma.candidateDocuments.findFirst({
            where: {
                AND: [
                    { tableName: "registrato" },
                    { tableId: _id }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
        const returnFiles = await Promise.all(
            [pix, registrato].filter(x => !!x).map(async file => {

                const url = await getAwsFile(file.path)
                return { ...file, url: url.fileUrl }


            })
        )
        return reply.status(200).send(returnFiles)
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
    }
}