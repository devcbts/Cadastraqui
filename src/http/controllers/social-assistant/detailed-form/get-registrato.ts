import { APIError } from "@/errors/api-error";
import { ForbiddenError } from "@/errors/forbidden-error";
import { getAwsFile } from "@/lib/S3";
import { historyDatabase } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

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
        const curr_id = await historyDatabase.idMapping.findFirst({
            where: { AND: [{ newId: _id }, { application_id }] }
        })
        if (!curr_id) {
            throw new APIError('Usuário não encontrado')
        }
        const files = await historyDatabase.candidateDocuments.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { tableName: "registrato" },
                            { tableName: "pix" }
                        ]
                    },
                    { application_id },
                    { tableId: curr_id.mainId }
                ]
            }
        })
        const returnFiles = await Promise.all(
            files.map(async file => {
                const url = await getAwsFile(file.path)
                return { ...file, url: url.fileUrl }

            })
        )
        return reply.status(200).send(returnFiles)
        // return reply.status(200).send(urls)
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
    }
}