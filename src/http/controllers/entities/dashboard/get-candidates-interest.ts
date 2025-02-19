import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AnnouncementNotExists } from '../../../../errors/announcement-not-exists-error';


const percentages = {
    cadastrante: 20,
    grupoFamiliar: 20,
    moradia: 5,
    veiculos: 5,
    rendaMensal: 20,
    despesas: 10,
    saude: 5,
    declaracoes: 15,
    // documentos: 0
}

export default async function getCandidatesInterest(request: FastifyRequest, reply: FastifyReply) {
    const interestSchema = z.object({
        announcement_id: z.string()
    })

    const { announcement_id } = interestSchema.parse(request.params)
    try {

        const announcement = await prisma.announcement.findUnique({
            where: { id: announcement_id }
        })
        if (!announcement) {
            throw new AnnouncementNotExists()
        }
        const uniqueResponsible = await prisma.application.findMany({
            where: { announcement_id: announcement_id },
            distinct: ['responsible_id']
        })
        const uniqueCandidate = await prisma.application.findMany({
            where: { AND: [{ responsible_id: null }, { announcement_id: announcement_id }] },
            distinct: ['candidate_id']
        })
        const allInterest = await prisma.announcementsSeen.findMany({
            where: { announcement_id },
            include: {
                candidate: {
                    include: {
                        IdentityDetails: {
                            select: {
                                landlinePhone: true
                            }
                        },
                        user: {
                            select: {
                                email: true,

                            }
                        },
                        FinishedRegistration: {
                            select: {
                                cadastrante: true,
                                grupoFamiliar: true,
                                moradia: true,
                                veiculos: true,
                                rendaMensal: true,
                                despesas: true,
                                saude: true,
                                declaracoes: true,
                            }
                        }
                    }
                },
                responsible: {
                    include: {
                        IdentityDetails: {
                            select: {
                                landlinePhone: true,
                            },
                        },
                        user: {
                            select: {
                                email: true,
                            }
                        },
                        FinishedRegistration: {
                            select: {
                                cadastrante: true,
                                grupoFamiliar: true,
                                moradia: true,
                                veiculos: true,
                                rendaMensal: true,
                                despesas: true,
                                saude: true,
                                declaracoes: true,
                            }
                        }
                    }
                }

            }
        })

        const applications = await prisma.application.findMany({
            where: { announcement_id },
            select: {
                responsible_id: true,
                candidate_id: true,
            }
        })
        const numberOfInterested = allInterest.length
        let numberOfFinishedRegistration = 0
        const candidateInterest = allInterest.map(userInterest => {
            const candidateInfo = userInterest.candidate || userInterest.responsible
            const dataToSend = {
                name: candidateInfo?.name,
                email: candidateInfo?.user?.email,
                phone: candidateInfo?.IdentityDetails?.landlinePhone,
            }
            const percentage = Object.entries(percentages).reduce((acc, curr) => {
                return acc += (candidateInfo?.FinishedRegistration?.[curr[0] as keyof typeof percentages] ? 1 : 0) * curr[1]
            }, 0)

            // const percentage = userInterest.percentage;
            let status;
            if (percentage === 100) {
                status = "Completo"
                numberOfFinishedRegistration++
            } else if (percentage === 0) {
                status = "Não Iniciado"
            } else {
                status = "Iniciado"
            }
            //Vericficar se o candidato/usuário está inscrito
            if (applications.some(application => application.candidate_id === candidateInfo?.id || application.responsible_id === candidateInfo?.id)) {
                status = "Inscrito"


            }
            return { ...dataToSend, status, percentage };
        })

        const rate = allInterest.length === 0
            ? 0
            : (uniqueCandidate.length + uniqueResponsible.length) / (allInterest.length)

        return reply.status(200).send({
            numberOfInterested,
            numberOfApplications: applications.length,
            numberOfFinishedRegistration,
            numberOfUnfinishedRegistration: numberOfInterested - numberOfFinishedRegistration,
            candidateInterest,
            rate
        })

    } catch (error: any) {
        console.log(error)
        if (error instanceof AnnouncementNotExists) {
            return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}