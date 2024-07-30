// Função desse código é servir como a última ação do assistente social em uma inscrição
// Ele pode conceder uma bolsa e gerar um registro no histórico e um indice na tabela de bolsas concedidas
// Ou ele pode escolher não conceder a bolsa e só gerar um registro no histórico de que o candidato teve seu pedido negado

import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'





export async function closeApplication(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const applicationParamsSchema = z.object({
        application_id: z.string(),
        announcement_id: z.string()

    })

    const scholarshipGrantedType = z.enum(['UNIFORM', 'TRANSPORT', 'FOOD', 'HOUSING', 'STUDY_MATERIAL'])


    const applicationBodySchema = z.object({
        description: z.string(),
        gaveUp: z.boolean(),
        granted: z.boolean(),
        ScholarshipCode: z.string().optional(),
        types: z.array(scholarshipGrantedType).optional(),
    })
    const { application_id, announcement_id } = applicationParamsSchema.parse(request.params)
    const { description, gaveUp, granted, ScholarshipCode, types } = applicationBodySchema.parse(request.body)
    try {
        

        // Caso 1: gaveUp true
        if (gaveUp) {
            await prisma.applicationHistory.create({
                data: {
                    application_id,
                    description: "Candidato desistiu da Bolsa de Estudo / Não efetuou a matricula",
                    createdBy: "Assistant"
                }
            })

            await prisma.application.update({
                where: { id: application_id },
                data: {
                    status: "Rejected"
                }
            })
        }


        else {

            // Caso 2: granted False
            if (!granted) {
                await prisma.applicationHistory.create({
                    data: {
                        application_id,
                        description: "Processo Indeferido",
                        createdBy: 'Assistant'
                    }
                })

                await prisma.application.update({
                    where: { id: application_id },
                    data: {
                        status: "Rejected"
                    }
                })
            }
            // Caso 3: granted True

            if (granted) {

                // Criar novo report no histórico da inscrição
                await prisma.applicationHistory.create({
                    data: {
                        application_id,
                        description: description,
                        createdBy: 'Assistant'


                    },
                })

                await prisma.application.update({
                    where: { id: application_id },
                    data: {
                        status: "Approved"
                    }
                })

                await prisma.scholarshipGranted.create({
                    data: {
                        gaveUp: false,
                        ScholarshipCode: ScholarshipCode!,
                        types,
                        application_id: application_id,
                        announcement_id: announcement_id

                    }
                })
            }
        }
        // Altera o status da inscrição



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
