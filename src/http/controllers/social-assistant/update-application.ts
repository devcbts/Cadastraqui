// Função desse código é servir como a última ação do assistente social em uma inscrição
// Ele pode conceder uma bolsa e gerar um registro no histórico e um indice na tabela de bolsas concedidas
// Ou ele pode escolher não conceder a bolsa e só gerar um registro no histórico de que o candidato teve seu pedido negado

import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import callNextCandidate from '@/utils/administrative Functions/call-next-candidate'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function updateApplication(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        application_id: z.string(),

    })
    const statusType = z.enum(["Approved", "Rejected", "Pending"])

    const applicationUpdateSchema = z.object({
        status: statusType.optional(),
        report: z.string().optional(),
        partial: z.boolean().optional(),
        parecerAditionalInfo: z.string().nullish(),
    })
    const { application_id } = applicationParamsSchema.parse(request.params)
    const { status, report, partial, parecerAditionalInfo } = applicationUpdateSchema.parse(request.body)
    try {

        await prisma.$transaction(async (tsPrisma) => {

            const application = await tsPrisma.application.findUniqueOrThrow({
                where: { id: application_id },
                include: { candidate: true }
            })
            await tsPrisma.application.update({
                where: { id: application_id },
                data: {
                    status: status,
                    ScholarshipPartial: partial,
                    parecerAditionalInfo

                }
            })
            if (status === 'Rejected') {

                await tsPrisma.applicationHistory.create({
                    data: {
                        application_id,
                        description: 'Inscrição indeferida',
                        createdBy: 'Assistant'

                    }
                })
                // Call Next Candidate in WaitingList
                await callNextCandidate(application.educationLevel_id, tsPrisma)

            }
            if (status === 'Approved') {


                await tsPrisma.applicationHistory.create({
                    data: {
                        application_id,
                        description: 'Inscrição deferida',
                        createdBy: 'Assistant'

                    }
                })
                await tsPrisma.scholarshipGranted.create({
                    data: {
                        application_id,
                        announcement_id: application.announcement_id,
                        candidateName: application.candidate.name,
                        candidateCPF: application.candidate.CPF,
                    }
                })
            }

        })
        return reply.status(201).send({ message: "Ação realizada com sucesso" })

    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(404).send({ message: err.message })
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }


        return reply.status(500).send({ message: err.message })
    }
}
