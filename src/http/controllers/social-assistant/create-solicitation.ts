import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import sendEmail from '@/http/services/send-email'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

// Mapeamento de tipos de solicitação para suas traduções em português
const solicitationTypeTranslations: { [key: string]: string } = {
    'Document': 'Documento',
    'Interview': 'Entrevista',
    'Visit': 'Visita'
}

// A lógica para a solicitação é ser um tipo específico de histórico, com um prazo específico e com um tipo específico também

export async function createSolicitation(
    request: FastifyRequest,
    reply: FastifyReply,
) {

    const solicitationType = z.enum(['Document', 'Interview', 'Visit'])

    const applicationParamsSchema = z.object({
        application_id: z.string(),
    })
    const applicationBodySchema = z.object({
        id: z.string().nullish(),
        description: z.string(),
        deadLineTime: z.string().optional().transform((d) => {
            if (d) {
                return new Date(d)
            }
            return undefined
        }),
        type: solicitationType
    })
    const { application_id } = applicationParamsSchema.parse(request.params)
    const solicitation = applicationBodySchema.parse(request.body)
    const { sub } = request.user
    try {
        // Criar novo report no histórico da inscrição 
        let id;
        // Se a solicitação for do tipo de documentos
        await prisma.$transaction(async (tsPrisma) => {
            const { deadLineTime, description, type } = solicitation
            if (solicitation.type === 'Interview' || solicitation.type === `Visit`) {
                const solicitationExists = await tsPrisma.requests.findFirst({
                    where: {
                        AND: [{ application_id }, { type }]
                    }
                })
                if (solicitationExists) {
                    throw new Error('Já existe uma solicitação deste tipo para esta inscrição')
                }

                const application = await tsPrisma.application.findUnique({
                    where: { id: application_id },
                    include: { 
                        candidate:
                        {
                            select: {
                                name: true,
                                user_id: true,
                                user: {
                                    select: {
                                        email: true,
                                    }
                                }
                            }
                        },
                        responsible: {
                            include: {
                                IdentityDetails: {
                                    select: {
                                        fullName: true,
                                    }
                                },
                                user: {
                                    select: {
                                        email: true,
                                    }
                                }
                            }
                        },announcement: { include: { AssistantSchedule: { where: { assistant: { user_id: sub } } } } }
                    }
                })
                if (!application) {
                    throw new ResourceNotFoundError()
                }
                if (application?.announcement.AssistantSchedule.length === 0) {
                    throw new Error('Reserve os horários para este edital na seção de Agenda antes de solicitar um agendamento.')
                }
               
                const email = application.responsible?.user.email || application.candidate.user?.email
                const name = application.responsible?.IdentityDetails?.fullName || application.candidate?.name
                const translatedType = solicitationTypeTranslations[solicitation.type]
                sendEmail({
                    subject: 'Nova Solicitação!',
                    to: email!,
                    body: `
                    <h1>Uma solicitação do tipo ${translatedType} foi feita!</h1>
                    <h2>Atenção ${name}, uma nova solicitação referente ao edital ${application.announcement.announcementName} foi feita para sua inscrição Nº${application.number}!</h2>
                    <h2>Descrição da solicitação: ${description} </h2>
                    ${deadLineTime ? `<h2>Prazo para a resposta: ${deadLineTime.toLocaleDateString()} </h2>` : ''}
                    <p>
                    <a href="https://www.cadastraqui.com.br/">Clique aqui</a> e faça login para poder visualizar sua solicitação!
                    </p>
                    `,
                    deadline: deadLineTime,
                    createdBy: "Assistant",
                    user_id: application.responsible?.user_id ?? application.candidate.user_id ?? undefined
                }).then(v => console.log('Email enviado', v))
            }
            
            const dbSolicitation = await tsPrisma.requests.create({
                data: {
                    application_id,
                    description: description,
                    type: type,
                    deadLine: deadLineTime,
                },
            })
            id = dbSolicitation.id
          
        })

        return reply.status(201).send({ id })

    } catch (err: any) {
        if (err instanceof NotAllowedError) {
            return reply.status(403).send({ message: err.message })
        }
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}
