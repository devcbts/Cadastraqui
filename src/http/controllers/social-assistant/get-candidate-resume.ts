import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { getSignedUrlsGroupedByFolder } from "@/lib/S3";
import { calculateAge } from "@/utils/calculate-age";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { CalculateIncomePerCapitaHDB } from "@/utils/Trigger-Functions/calculate-income-per-capita-HDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getAssistantDocumentsPDF_HDB } from "./AWS-routes/get-assistant-documents-by-section";
import { getSectionDocumentsPDF_HDB } from "./AWS-routes/get-documents-by-section-HDB";

export async function getCandidateResume(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const AssistantParamsSchema = z.object({
        application_id: z.string(),
    })


    const { application_id } = AssistantParamsSchema.parse(request.params)

    const section = ['identity',
        'housing',
        'family-member',
        'monthly-income',
        'income',
        'bank',
        'registrato',
        'statement',
        'health',
        'medication',
        'vehicle',
        'expenses',
        'loan',
        'financing',
        'credit-card']
    try {
        const user_id = request.user.sub;

        const isAssistant = await prisma.socialAssistant.findUnique({
            where: { user_id }
        })
        if (!isAssistant) {
            throw new ForbiddenError()

        }
        const application = await prisma.application.findUnique({
            where: { id: application_id },
            include: {
                candidate: true,
                ScholarshipGranted: true,
                EducationLevel: {
                    include: {
                        entitySubsidiary: true,
                    }
                },
                announcement: {
                    include: {
                        entity: true
                    }
                }
            }
        })
        if (!application) {
            throw new ResourceNotFoundError()

        }
        const candidate = application.candidate

        const candidateHDB = await historyDatabase.candidate.findUnique({
            where: { application_id }
        })

        const candidateOrResponsibleHDB = await SelectCandidateResponsibleHDB(application_id)
        if (!candidateOrResponsibleHDB) {
            throw new ResourceNotFoundError()
        }
        if (!candidateHDB) {
            throw new ResourceNotFoundError()

        }
        const identityDetails = await historyDatabase.identityDetails.findUnique({
            where: { application_id }
        })
        if (!identityDetails) {
            throw new ResourceNotFoundError()
        }
        const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapitaHDB(candidateOrResponsibleHDB.UserData.id)


        const responsibleInfo = {
            id: candidateOrResponsibleHDB.UserData.id,
            name: identityDetails.fullName,
            cpf: identityDetails.CPF,
            age: calculateAge(identityDetails.birthDate),
            profession: identityDetails.profession,
            income: incomesPerMember[candidateOrResponsibleHDB.UserData.id],
            hasCompany: application.CPFCNPJ

        }



        const familyMembers = await historyDatabase.familyMember.findMany({
            where: { application_id }
        })
        let candidateInfo
        if (candidateOrResponsibleHDB.IsResponsible) {
            const candidateFamilyMember = familyMembers.find((familyMember) => familyMember.CPF === candidateHDB.CPF)
            if (!candidateFamilyMember) {
                candidateInfo = {}
            } else {

                candidateInfo = {
                    id: candidateHDB.id,
                    number: application.number,
                    name: candidateFamilyMember.fullName,
                    cpf: candidateFamilyMember.CPF,
                    age: calculateAge(candidateFamilyMember.birthDate),
                    profession: candidateFamilyMember.profession,
                    income: incomesPerMember[candidateFamilyMember.id],


                }
            }
        } else {


            candidateInfo = {
                id: candidateHDB.id,
                number: application.number,
                name: identityDetails.fullName,
                cpf: identityDetails.CPF,
                age: calculateAge(identityDetails.birthDate),
                profession: identityDetails.profession,
                income: incomesPerMember[candidateHDB.id],

            }

        }

        const familyMembersInfo = familyMembers.map((familyMember) => {
            return {
                id: familyMember.id,
                name: familyMember.fullName,
                cpf: familyMember.CPF,
                age: calculateAge(familyMember.birthDate),
                profession: familyMember.profession,
                relationship: familyMember.relationship,
                income: incomesPerMember[familyMember.id]
            }
        })

        const housingInfo = await historyDatabase.housing.findUnique({
            where: { application_id },
            select: {
                domicileType: true,
                propertyStatus: true,
                numberOfBedrooms: true,
                numberOfRooms: true
            }
        })

        const vehicles = await historyDatabase.vehicle.findMany({
            where: { application_id },
            select: {
                _count: true,
                modelAndBrand: true,
                manufacturingYear: true,
                hasInsurance: true,
                situation: true,
                vehicleType: true
            }
        })
        const diseases = await historyDatabase.familyMemberDisease.findMany({
            where: { application_id },
            include: {
                Medication: true,
                familyMember: true,
                candidate: true,
                legalResponsible: true
            }
        })
        //Get all medications with no link with disease
        const familyMemberMedications = await historyDatabase.medication.findMany({
            where: { AND: [{ application_id }, { familyMemberDiseaseId: null }] },
            include: {
                candidate: true,
                familyMember: true,
                legalResponsible: true
            }
        })
        const familyMembersDiseases = diseases.map((disease) => {
            return {
                id: disease.id,
                name: disease.familyMember?.fullName || identityDetails.fullName,
                disease: disease.disease,
                medication: disease.Medication.map((medication) => {
                    return {
                        name: medication.medicationName,
                        obtainedPublicy: medication.obtainedPublicly,
                    }
                })
            }
        }).concat(familyMemberMedications.map((medication) => {
            return {
                id: medication.id,
                name: medication.familyMember?.fullName || identityDetails.fullName,
                disease: null,
                medication: [{
                    name: medication.medicationName,
                    obtainedPublicy: medication.obtainedPublicly,
                }]
            }
        })).sort((a, b) => {
            // sort by name so it'll display all diseases/medications for one person at a time
            return a.name < b.name ? -1 : 1
        })


        const expenses = await historyDatabase.expense.findMany({
            where: { application_id },

            select: {
                totalExpense: true,


            }
        })



        const importantInfo = {
            cadUnico: identityDetails.CadUnico,
            familyIncome: incomePerCapita * (familyMembers.length + 1),
            familyExpenses: expenses ? expenses.reduce((acc, expense) => acc + expense.totalExpense!, 0) / (expenses.length) : 0,
            hasSevereDisease: application.hasSevereDesease,
            housingSituation: housingInfo?.propertyStatus,
            vehiclesCount: vehicles.length,
            distance: application.distance,
        }
        const getDocumentsUrls = async (sections: string[], application_id: string) => {
            const documentsPromises = sections.map(section =>
                getSectionDocumentsPDF_HDB(application_id, section).then(document => ({ [section]: document }))
            );
            return Promise.all(documentsPromises);
        };
        const documentsUrls = await getDocumentsUrls(section, application_id)
        const membersNames = familyMembers.map((member) => {
            return {

                id: member.id,
                name: member.fullName
            }
        }
        )
        membersNames.push({ id: candidateHDB.id, name: identityDetails.fullName })

        const documentsFilteredByMember = membersNames.map(member => {
            const groupedDocuments: { [key: string]: { [fileName: string]: string[] } } = {};

            documentsUrls.forEach((sectionUrls) => {
                Object.entries(sectionUrls).forEach(([section, urls]) => {
                    Object.entries(urls).forEach(([path, fileName]) => {
                        const parts = path.split('/');
                        if (parts[3] === member.id) {
                            if (!groupedDocuments[section]) {
                                groupedDocuments[section] = {};
                            }
                            Object.entries(fileName).forEach(([Name, url]) => {

                                if (!groupedDocuments[section][Name]) {
                                    groupedDocuments[section][Name] = [];
                                }
                                groupedDocuments[section][Name].push(url);
                            })
                        }
                    });
                });

            });
            return { member: member.name, documents: groupedDocuments };
        })


        const applicationFormated = {
            id: application.id,
            number: application.number,
            announcement: application.announcement.announcementName,
            course: application.EducationLevel.availableCourses ?? application.EducationLevel.grade,
            shift: application.EducationLevel.shift,
            entity: application.announcement.entity.socialReason,
            city: application.EducationLevel.entitySubsidiary ? application.EducationLevel.entitySubsidiary.city : application.announcement.entity.city,
            partial: application.ScholarshipPartial,
            status: application.status
        }


        // Documentos de solicitações
        const majoracao = await getAssistantDocumentsPDF_HDB(application_id, 'majoracao')
        const interviewDocument = await getAssistantDocumentsPDF_HDB(application_id, 'Interview')
        const visitDocument = await getAssistantDocumentsPDF_HDB(application_id, 'Visit')

        const solicitations = await prisma.requests.findMany({
            where: { AND: [{ application_id }, { type: 'Document' }] },

        })
        const solicitationFolder = `SolicitationDocuments/${application.id}`
        const solicitationsUrls = await getSignedUrlsGroupedByFolder(solicitationFolder);
        const solicitationsFiltered = solicitations.map((solicitation) => {
            const solicitationDocument = Object.entries(solicitationsUrls).filter(([url]) => url.split('/')[2] === solicitation.id)
            return {
                ...solicitation,
                urls: Object.fromEntries(solicitationDocument)
            }
        })

        return reply.status(200).send({
            candidateInfo,
            responsibleInfo,
            familyMembersInfo,
            housingInfo,
            vehicles,
            familyMembersDiseases,
            importantInfo,
            documentsUrls: documentsFilteredByMember,
            applicationInfo: applicationFormated,
            majoracao: majoracao,
            interviewDocument: interviewDocument,
            visitDocument: visitDocument,
            solicitations: solicitationsFiltered
        })
    } catch (error: any) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })
        }
        if (error instanceof ForbiddenError) {
            return reply.status(403).send({ message: error.message })
        }
        return reply.status(500).send({ message: error.message })
    }
}