import { prisma } from "@/lib/prisma";
import { AllEducationType, AllScholarshipsType, LevelType, } from "@prisma/client";
import * as csvWriter from 'csv-writer';
import { FastifyReply, FastifyRequest } from "fastify";
import * as fs from 'fs';
import path from "path";
import { z } from "zod";
import formatDate from '../../../../utils/format-date';



const levelTranslation = {
    [LevelType.BasicEducation]: 'Educação Básica',
    [LevelType.HigherEducation]: 'Educação Superior'
}

const courseTypeTranslation = {
    [AllEducationType.Preschool]: "Pré - Escola",
    [AllEducationType.Elementary]: 'Fundamental I e II',
    [AllEducationType.HighSchool]: "Ensino Médio",
    [AllEducationType.ProfessionalEducation]: "Ensino Profissional",


    [AllEducationType.Postgraduate]: "Pós Graduação",
    [AllEducationType.UndergraduateBachelor]: "Bacharelado",
    [AllEducationType.UndergraduateLicense]: "Licenciatura",
    [AllEducationType.UndergraduateTechnologist]: "Tecnólogo"
}


const scholarshipOfferTranslation = {
    [AllScholarshipsType.CityGovernment]: "Governo Municipal",
    [AllScholarshipsType.CityGovernmentPartial]: "Governo Municipal Parcial",
    [AllScholarshipsType.ExternalEntities]: "Entidades Externas",
    [AllScholarshipsType.HigherEduInstitutionFull]: "Instituições de Ensino Superior",
    [AllScholarshipsType.HigherEduInstitutionPartial]: "Instituições de Ensino Superior Parcial",
    [AllScholarshipsType.HigherEduInstitutionWorkers]: "Trabalhadores da Instituição de Ensino Superior",
    [AllScholarshipsType.HigherEduInstitutionWorkersPartial]: "Trabalhadores da Instituição de Ensino Superior Parcial",
    [AllScholarshipsType.PROUNIFull]: "PROUNI Integral",
    [AllScholarshipsType.PROUNIPartial]: "PROUNI Parcial",
    [AllScholarshipsType.PostgraduateStrictoSensu]: "Pós Graduação Stricto Sensu",
    [AllScholarshipsType.PostgraduateStrictoSensuPartial]: "Pós Graduação Stricto Sensu Parcial",
    [AllScholarshipsType.StateGovernment]: "Governo Estadual",
    [AllScholarshipsType.StateGovernmentPartial]: "Governo Estadual Parcial",
    [AllScholarshipsType.ExternalEntitiesPartial]: "Entidades Externas Parcial",
    [AllScholarshipsType.EntityWorkers]: "Trabalhadores da Entidade",
    [AllScholarshipsType.EntityWorkersPartial]: "Trabalhadores da Entidade Parcial",
    [AllScholarshipsType.FullTime]: "Tempo Integral",
    [AllScholarshipsType.FullTimePartial]: "Tempo Integral (Parcial)",
    [AllScholarshipsType.Law187Scholarship]: "Bolsa Lei 187",
    [AllScholarshipsType.Law187ScholarshipPartial]: "Bolsa Lei 187 Parcial",
    [AllScholarshipsType.StudentWithDisability]: "Estudante com Deficiência",
    [AllScholarshipsType.StudentWithDisabilityPartial]: "Estudante com Deficiência (Parcial)",

}


export default async function getPartialReport(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const partialReportParams = z.object({
        announcement_id: z.string(),
        entity_id: z.string()
    })

    const partialReportFormat = z.object({
        format: z.enum(['PDF', 'CSV'])
    })
    const { announcement_id, entity_id } = partialReportParams.parse(request.params)
    const { format } = partialReportFormat.parse(request.query)
    try {

        const entityInfo = await prisma.entitySubsidiary.findUnique({
            where: { id: entity_id },
            include: {
                user: true
            }
        }) || await prisma.entity.findUnique({
            where: { id: entity_id }, include: {
                user: true
            }
        })

        let scholarships;

        if (entityInfo && entityInfo.user.role === 'ENTITY') { // Supondo que 'type' indica se é principal ou subsidiária
            scholarships = await prisma.scholarshipGranted.findMany({
                where: {
                    application: {
                        announcement_id,
                        EducationLevel: {
                            entitySubsidiaryId: null
                        }
                    }
                },
                include: {
                    application: {
                        include: {
                            candidate: true,
                            responsible: true,
                            EducationLevel: {
                                include: { course: true }
                            },
                        }
                    }
                }
            });
        } else {
            scholarships = await prisma.scholarshipGranted.findMany({
                where: {
                    application: {
                        announcement_id,
                        EducationLevel: {
                            entitySubsidiaryId: entity_id
                        }
                    }
                },
                include: {
                    application: {
                        include: {
                            candidate: true,
                            responsible: true,
                            EducationLevel: {
                                include: { course: true }
                            }
                        }
                    }
                }
            })
        }


        if (format == 'PDF') {

            const scholarshipsInfos = scholarships.map((scholarship) => {
                return {
                    level: scholarship.application.EducationLevel.level,
                    courseType: scholarship.application.EducationLevel.course?.Type,
                    course: scholarship.application.EducationLevel.course?.name,
                    candidateName: scholarship.application.candidate.name,
                    candidateBirthDate: formatDate(scholarship.application.candidate.birthDate.toString()),
                    candidateCPF: scholarship.application.candidate.CPF,
                    responsibleCPF: scholarship.application.responsible?.CPF,
                    ScholarshipOfferType: scholarship.application.EducationLevel.typeOfScholarship,
                    partiaPercentage: scholarship.application.ScholarshipPartial,
                    ScholarshipCode: scholarship.ScholarshipCode
                }
            })

            return reply.status(200).send({ scholarshipsInfos })
        }


        if (format == 'CSV') {

            const scholarshipsInfos = scholarships.map((scholarship) => {
                return {
                    level: levelTranslation[scholarship.application.EducationLevel.level],
                    courseType: `${courseTypeTranslation[(scholarship.application.EducationLevel.course?.Type)!]} - ${scholarship.application.EducationLevel.course?.name} `,
                    candidateName: scholarship.application.candidate.name,
                    candidateBirthDate: formatDate(scholarship.application.candidate.birthDate.toString()),
                    ScholarshipCode: scholarship.ScholarshipCode,
                    candidateCPF: scholarship.application.candidate.CPF,
                    responsibleCPF: scholarship.application.responsible?.CPF,
                    ScholarshipOfferType: scholarshipOfferTranslation[(scholarship.application.EducationLevel.typeOfScholarship)!],
                    partialPercentage: scholarship.application.ScholarshipPartial ? "50%" : "100%",
                }
            })

            // Define the path and filename for the CSV file

            // Define the headers for the CSV file
            const headers = [
                { id: 'level', title: 'Nível de ensino' },
                { id: 'courseType', title: 'Etapa/Curso' },
                { id: 'candidateName', title: 'Nome do bolsista' },
                { id: 'candidateBirthDate', title: 'Data de Nascimento' },
                { id: 'ScholarshipCode', title: 'Código de identificação do bolsista no censo' },
                { id: 'candidateCPF', title: 'CPF do bolsista' },
                { id: 'responsibleCPF', title: 'CPF do responsável (se houver)' },
                { id: 'ScholarshipOfferType', title: 'Tipo de bolsa de estudo' },
                { id: 'partialPercentage', title: 'Porcentagem da bolsa' },
            ];

            // Create a new CSV writer instance
            const writer = csvWriter.createObjectCsvWriter({
                path: 'scholarships.csv',
                header: headers,
            });

            // Write the scholarshipsInfos data to the CSV file
            await writer.writeRecords(scholarshipsInfos);
            const filePath = path.resolve('scholarships.csv');
            const fileStream = fs.createReadStream(filePath);
            fileStream.on('end', () => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Erro ao deletar o arquivo:', err);
                    } else {
                        console.log('Arquivo deletado com sucesso');
                    }
                });
            });
            reply.header('Content-Type', 'text/csv');
            reply.header('Content-Disposition', 'attachment; filename="scholarships.csv"');
            return reply.status(200).send(fileStream);
        }



    } catch (error: any) {
        return reply.status(500).send({ message: error.message })
    }
}