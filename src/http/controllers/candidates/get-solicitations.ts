import { ForbiddenError } from "@/errors/forbidden-error";
import { prisma } from "@/lib/prisma";
import { getSignedUrlsGroupedByFolder } from "@/lib/S3";
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible";
import { FastifyReply, FastifyRequest } from "fastify";
import { object, z } from "zod";

export default async function getSolicitations(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestParamsSchema = z.object({
        application_id: z.string().optional()
    })
    const { application_id } = requestParamsSchema.parse(request.params);
    try {
        const user_id = request.user.sub;
        const CandidateOrResponsible = await SelectCandidateResponsible(user_id);
        if (!CandidateOrResponsible) {
            throw new ForbiddenError();
        }
        const idField = CandidateOrResponsible.IsResponsible ? { responsible_id: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id };
        if (application_id) {
            const solicitations = await prisma.applicationHistory.findMany({
                where: { application_id, solicitation: { not: null } }
            });
            const Folder = `SolicitationDocuments/${application_id}`

            const urls = await getSignedUrlsGroupedByFolder(Folder)
            const solicitationsFormated = solicitations.map((solicitation) => {
                const matchedUrls = Object.entries(urls).filter(([url]) => url.split("/")[2] === solicitation.id)
                return {
                    id: solicitation.id,
                    solicitation: solicitation.solicitation,
                    matchedUrls
                }
            })
            return reply.status(200).send({ solicitations: solicitationsFormated });
        }

        const solicitations = await prisma.applicationHistory.findMany({
            where: { solicitation: { not: null } },

        });


        const applications = await prisma.application.findMany({
            where: idField,
            include: {
                announcement: {
                    include: {
                        entity: true,

                    }
                },
                EducationLevel: {
                    include: {
                        entitySubsidiary: true
                    }
                }
            }
        })

        const applicationsFormated = applications.map((application) => {
            const numberOfSolicitations = solicitations.filter((solicitation) => solicitation.application_id === application.id && solicitation.answered === false).length;
            const status = numberOfSolicitations === 0 ? "Sem pendências" : solicitations.some(solicitation => solicitation.deadLine ? solicitation.deadLine < new Date() : '') ? "Urgência" : "Pendência";
            return {
                id: application.id,
                name: application.candidateName,
                announcement: application.announcement.announcementName,
                number: application.number,
                pendencias: numberOfSolicitations,
                status,
                entidade: application.EducationLevel.entitySubsidiary ? application.EducationLevel.entitySubsidiary.socialReason : application.announcement.entity.socialReason,


            }
        })

        return reply.status(200).send({ solicitations: applicationsFormated });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message });
        }
    }
}