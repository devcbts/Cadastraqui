import { prisma } from "@/lib/prisma";
import { BasicEducationType, HigherEducationScholarshipType, LevelType, OfferedCourseType, ScholarshipOfferType } from "@prisma/client";
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
    [BasicEducationType.Preschool]: "Pré - Escola",
    [BasicEducationType.Elementary]: 'Fundamental I e II',
    [BasicEducationType.HighSchool]: "Ensino Médio",
    [BasicEducationType.ProfessionalEducation]: "Ensino Profissional",


    [OfferedCourseType.Postgraduate]: "Pós Graduação",
    [OfferedCourseType.UndergraduateBachelor]: "Bacharelado",
    [OfferedCourseType.UndergraduateLicense]: "Licenciatura",
    [OfferedCourseType.UndergraduateTechnologist]: "Tecnólogo"
}


const scholarshipOfferTranslation = {
    [HigherEducationScholarshipType.CityGovernment]: "Governo Municipal",
    [HigherEducationScholarshipType.CityGovernmentPartial]: "Governo Municipal Parcial",
    [HigherEducationScholarshipType.ExternalEntities]: "Entidades Externas",
    [HigherEducationScholarshipType.HigherEduInstitutionFull]: "Instituições de Ensino Superior",
    [HigherEducationScholarshipType.HigherEduInstitutionPartial]: "Instituições de Ensino Superior Parcial",
    [HigherEducationScholarshipType.HigherEduInstitutionWorkers]: "Trabalhadores da Instituição de Ensino Superior",
    [HigherEducationScholarshipType.HigherEduInstitutionWorkersPartial]: "Trabalhadores da Instituição de Ensino Superior Parcial",
    [HigherEducationScholarshipType.PROUNIFull]: "PROUNI Integral",
    [HigherEducationScholarshipType.PROUNIPartial]: "PROUNI Parcial",
    [HigherEducationScholarshipType.PostgraduateStrictoSensu]: "Pós Graduação Stricto Sensu",
    [HigherEducationScholarshipType.PostgraduateStrictoSensuPartial]: "Pós Graduação Stricto Sensu Parcial",
    [HigherEducationScholarshipType.StateGovernment]: "Governo Estadual",
    [HigherEducationScholarshipType.StateGovernmentPartial]: "Governo Estadual Parcial",
    [HigherEducationScholarshipType.ExternalEntitiesPartial]: "Entidades Externas Parcial",
    [ScholarshipOfferType.EntityWorkers]: "Trabalhadores da Entidade",
    [ScholarshipOfferType.EntityWorkersPartial]: "Trabalhadores da Entidade Parcial",
    [ScholarshipOfferType.FullTime]: "Tempo Integral",
    [ScholarshipOfferType.FullTimePartial]: "Tempo Integral (Parcial)",
    [ScholarshipOfferType.Law187Scholarship]: "Bolsa Lei 187",
    [ScholarshipOfferType.Law187ScholarshipPartial]: "Bolsa Lei 187 Parcial",
    [ScholarshipOfferType.StudentWithDisability]: "Estudante com Deficiência",
    [ScholarshipOfferType.StudentWithDisabilityPartial]: "Estudante com Deficiência (Parcial)",

}


export default async function getFullReport(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const partialReportParams = z.object({
        announcement_id: z.string(),
    })

    const partialReportFormat = z.object({
        format: z.enum(['PDF', 'CSV'])
    })
    const { announcement_id } = partialReportParams.parse(request.params)
    const { format } = partialReportFormat.parse(request.query)
    try {


        const scholarships = await prisma.scholarshipGranted.findMany({
            where: {
                status: "REGISTERED",
                application: {
                    announcement_id
                }
            }, include: {
                application: {
                    include: {
                        announcement: {
                            include: {
                                entity: {
                                    select: {
                                        emec: true
                                    }
                                }
                            }
                        },
                        candidate: true,
                        responsible: true,
                        EducationLevel: {
                            include: {
                                entitySubsidiary: {
                                    select: {
                                        educationalInstitutionCode: true
                                    }
                                }
                            }
                        },

                    }

                }
            },

        })



        if (format == 'PDF') {

            const scholarshipsInfos = scholarships.map((scholarship) => {
                return {
                    educationalCENSUSInstitutionCode: (scholarship.application.EducationLevel.entitySubsidiary ? scholarship.application.EducationLevel.entitySubsidiary.educationalInstitutionCode : scholarship.application.announcement.entity.emec),
                    level: scholarship.application.EducationLevel.level,
                    courseType: scholarship.application.EducationLevel.basicEduType || scholarship.application.EducationLevel.offeredCourseType,
                    course: scholarship.application.EducationLevel.availableCourses ?? scholarship.application.EducationLevel.grade,
                    candidateName: scholarship.application.candidate.name,
                    candidateBirthDate: formatDate(scholarship.application.candidate.birthDate.toString()),
                    candidateCPF: scholarship.application.candidate.CPF,
                    responsibleCPF: scholarship.application.responsible?.CPF,
                    ScholarshipOfferType: scholarship.application.EducationLevel.higherEduScholarshipType || scholarship.application.EducationLevel.scholarshipType,
                    partiaPercentage: scholarship.application.ScholarshipPartial,
                    ScholarshipCode: scholarship.ScholarshipCode

                }
            })

            return reply.status(200).send({ scholarshipsInfos })
        }


        if (format == 'CSV') {

            const scholarshipsInfos = scholarships.map((scholarship) => {
                return {
                    educationalCENSUSInstitutionCode: (scholarship.application.EducationLevel.entitySubsidiary ? scholarship.application.EducationLevel.entitySubsidiary.educationalInstitutionCode : scholarship.application.announcement.entity.emec),
                    level: levelTranslation[scholarship.application.EducationLevel.level],
                    courseType: `${courseTypeTranslation[(scholarship.application.EducationLevel.basicEduType || scholarship.application.EducationLevel.offeredCourseType)!]} - ${scholarship.application.EducationLevel.availableCourses ?? scholarship.application.EducationLevel.grade} `,
                    candidateName: scholarship.application.candidate.name,
                    candidateBirthDate: formatDate(scholarship.application.candidate.birthDate.toString()),
                    ScholarshipCode: scholarship.ScholarshipCode,
                    candidateCPF: scholarship.application.candidate.CPF,
                    responsibleCPF: scholarship.application.responsible?.CPF,
                    ScholarshipOfferType: scholarshipOfferTranslation[(scholarship.application.EducationLevel.higherEduScholarshipType || scholarship.application.EducationLevel.scholarshipType)!],
                    partialPercentage: scholarship.application.ScholarshipPartial ? "50%" : "100%",
                }
            })

            // Define the path and filename for the CSV file

            // Define the headers for the CSV file
            const headers = [
                { id: 'educationalCENSUSInstitutionCode', title: 'Código da Instituição de ensino no Censo' },
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