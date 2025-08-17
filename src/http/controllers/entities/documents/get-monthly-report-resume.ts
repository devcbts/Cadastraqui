import { APIError } from "@/errors/api-error";
import { GetUrl } from "@/http/services/get-file";
import { prisma } from "@/lib/prisma";
import { getUserEntity } from "@/utils/get-user-entity";
import { CalculateIncomePerCapita } from "@/utils/Trigger-Functions/calculate-income-per-capita";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getLegalMonthlyReportResume(req: FastifyRequest, res: FastifyReply) {
    try {
        const { sub, role } = req.user
        const socialAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id: sub },
            select: {
                CPF: true,
                RG: true,
                CRESS: true,
                name: true,
            }
        })
        if (!socialAssistant) {
            throw new APIError("Este relatório é apenas para assistente social")
        }
        const entityId = await getUserEntity(sub, role)
        const entity = await prisma.entity.findUnique({
            where: { id: entityId },
            select: {
                address: true,
                addressNumber: true,
                CEP: true,
                educationalInstitutionCode: true,
                CNPJ: true,
                city: true,
                neighborhood: true,
                socialReason: true,
                UF: true,
            }
        })
        const Route = `ProfilePictures/${entityId}`
        const logo = await GetUrl(Route)
        const scholarships = await prisma.scholarshipGranted.findMany({
            where: {
                announcement: {
                    AND: [{
                        OR: [{ entity_id: entityId }],
                        announcementDate: { gte: new Date() },
                    }],
                },
                status: "SELECTED"
            },
            select: {
                id: true,
                ScholarshipCode: true,
                candidateName: true,
                candidateCPF: true,
                announcement: { select: { entity: { select: { educationalInstitutionCode: true } }, entity_subsidiary: { select: { educationalInstitutionCode: true } } } },
                application: {
                    select: {
                        ScholarshipPartial: true, candidate_id: true, responsible_id: true, responsible: { select: { CPF: true } },
                        candidate: { select: { birthDate: true } },
                        EducationLevel: {
                            select: {
                                level: true,
                                typeOfScholarship: true,
                                course: true
                            }
                        }
                    }
                }
            }
        })
        const mappedScholarships = await Promise.all(scholarships.map(async x => ({
            ...x,
            perCapita: (await CalculateIncomePerCapita(x.application.responsible_id ?? x.application.candidate_id)).incomePerCapita
        })))
        return res.status(200).send({
            scholarships: mappedScholarships, entity: { ...entity, img: logo },
            socialAssistant
        })
    } catch (err) {
        if (err instanceof APIError) {
            return res.status(400).send({
                message: err.message
            })
        }
        return res.status(500).send({
            message: 'Erro interno no servidor'
        })
    }
}