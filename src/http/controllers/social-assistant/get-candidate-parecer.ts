import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { getAwsFileFromFolder } from "@/lib/S3";
import { calculateAge } from "@/utils/calculate-age";
import { SelectCandidateResponsibleHDB } from "@/utils/select-candidate-responsibleHDB";
import { CalculateIncomePerCapitaHDB } from "@/utils/Trigger-Functions/calculate-income-per-capita-HDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getAssistantDocumentsPDF_HDB } from "./AWS-routes/get-assistant-documents-by-section";

export async function getCandidateParecer(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const AssistantParamsSchema = z.object({
        application_id: z.string(),
    })

    const { application_id } = AssistantParamsSchema.parse(request.params)

    const section = ["identity",
        "housing",
        "family-member",
        "monthly-income",
        "income",
        "bank",
        "registrato",
        "statement",
        "health",
        "medication",
        "vehicle",
        "expenses",
        "loan",
        "financing",
        "credit-card"]
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
                announcement: { select: { announcementName: true } }
            }
        })

        if (!application) {
            throw new ResourceNotFoundError()

        }
        const candidate = application.candidate

        const candidateHDB = await historyDatabase.candidate.findUnique({
            where: { application_id }
        })
        if (!candidateHDB) {
            throw new ResourceNotFoundError()

        }
        const identityDetails = await historyDatabase.identityDetails.findUnique({
            where: { application_id }
        })
        if (!identityDetails) {
            throw new ResourceNotFoundError()
        }
        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
        const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapitaHDB(candidateOrResponsible?.UserData.id)
        console.log(incomesPerMember)
        const candidateInfo = {
            id: candidateHDB.id,
            name: identityDetails.fullName,
            cpf: identityDetails.CPF,
            nationality: identityDetails.nationality,
            maritalStatus: identityDetails.maritalStatus,
            email: identityDetails.email,
            RG: identityDetails.RG,
            rgIssuingState: identityDetails.rgIssuingState,
            rgIssuingAuthority: identityDetails.rgIssuingAuthority,
            age: calculateAge(identityDetails.birthDate),
            profession: identityDetails.profession,
            income: incomesPerMember[candidateHDB.id],
            address: identityDetails.address,
            addressNumber: identityDetails.addressNumber,
            city: identityDetails.city,
            CEP: identityDetails.CEP,
            UF: identityDetails.UF,
            neighborhood: identityDetails.neighborhood,

        }

        const familyMembers = await historyDatabase.familyMember.findMany({
            where: { application_id }
        })

        const familyMembersInfo = familyMembers.map((familyMember) => {
            console.log(familyMember.birthDate)
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
        })

        const vehicles = await historyDatabase.vehicle.findMany({
            where: { application_id },
            select: {
                _count: true,
                modelAndBrand: true,
                manufacturingYear: true,
                hasInsurance: true,
                situation: true,
                vehicleType: true,
                owners_id: true
            }
        })

        const familyMemberNames = familyMembers.reduce((map, member) => {
            map[member.id] = member.fullName;
            return map;
        }, {} as { [id: string]: string });
        familyMemberNames[candidate.id] = candidate.name;


        // Prepare the results, pairing the owner's id with the family member's name
        const vehicleInfoResults = vehicles.map(vehicle => {
            const ownerNames = vehicle.owners_id.map(id => familyMemberNames[id] ?? identityDetails.fullName);
            return {
                ...vehicle,
                ownerNames, // Array with the names of all owners
            };
        });
        const diseases = await historyDatabase.familyMemberDisease.findMany({
            where: { application_id },
            include: {
                Medication: true,
                familyMember: true,
                candidate: true,
                legalResponsible: true
            }
        })
        const familyMembersDiseases = diseases.map((disease) => {
            return {
                id: disease.id,
                name: disease.familyMember?.fullName || identityDetails.fullName,
                disease: disease.diseases?.[0],
                hasMedicalReport: disease.hasMedicalReport,
                medications: disease.Medication
            }
        })

        const medications = await historyDatabase.medication.findMany({
            where: { application_id },
            include: {
                familyMember: true,
                candidate: true,
                legalResponsible: true
            }
        })
        const familyMemberMedications = medications.map((medication) => {
            return {
                id: medication.id,
                name: medication.familyMember?.fullName || identityDetails.fullName,
                medicationName: medication.medicationName,
                obtainedPublicly: medication.obtainedPublicly,
            };
        });

        // Initialize the result object
        const familyMedicationsSummary: { [key: string]: { medications: string[], obtainedPublicly: boolean, medicationsObtainedPublicly: string[] } } = {};

        familyMemberMedications.forEach(medication => {
            const memberName = medication.name;
            // Initialize the member in the summary object if not already present
            if (!familyMedicationsSummary[memberName]) {
                familyMedicationsSummary[memberName] = { medications: [], obtainedPublicly: true, medicationsObtainedPublicly: [] };
            }
            // Add medication name to the medications list
            familyMedicationsSummary[memberName].medications.push(medication.id);
            // If the medication was obtained publicly, add it to the medicationsObtainedPublicly list
            if (medication.obtainedPublicly) {
                familyMedicationsSummary[memberName].medicationsObtainedPublicly.push(medication.id);
            } else {
                // If any medication was not obtained publicly, set obtainedPublicly to false
                familyMedicationsSummary[memberName].obtainedPublicly = false;
            }
        });
        const expenses = await historyDatabase.expense.findMany({
            where: { application_id },

            select: {
                totalExpense: true,


            }
        })

        const totalExpenses = expenses.length > 0 ? expenses.reduce((total, expense) => total + (expense.totalExpense ?? 0), 0) / expenses.length : 0;
        const totalIncome = Object.values(incomesPerMember).reduce((acc, income) => {
            return acc += income
        }, 0)
        const hasGreaterIncome = totalIncome > totalExpenses
        const majoracao = await getAssistantDocumentsPDF_HDB(application_id, 'majoracao')
        const parecer = await getAssistantDocumentsPDF_HDB(application_id, 'parecer')


        const documentsUrls = await Promise.all(section.map(async sec => await getAwsFileFromFolder(`applicationDocuments/${application_id}/${sec}`)))
        const membersNames = familyMembers.map((member) => {
            return {

                id: member.id,
                name: member.fullName
            }
        }
        )
        membersNames.push({ id: candidateHDB.responsible_id ?? candidateHDB.id, name: identityDetails.fullName })
        console.log(membersNames)
        const documentsFilteredByMember = documentsUrls.map(folder => {
            const documents: any[] = []
            folder.forEach(file => {
                membersNames.forEach(member => {
                    if (member.id === file.fileKey.split('/')[3]) {
                        documents.push({ ...member, ...file })
                    }
                })
            })
            return documents
        })
        // const documentsFilteredByMember = membersNames.map(member => {
        //     const groupedDocuments: { [key: string]: { [fileName: string]: string[] } } = {};

        //     documentsUrls.forEach((sectionUrls) => {
        //         Object.entries(sectionUrls).forEach(([section, urls]) => {
        //             Object.entries(urls).forEach(([path, fileName]) => {
        //                 const parts = path.split('/');
        //                 if (parts[3] === member.id) {
        //                     if (!groupedDocuments[section]) {
        //                         groupedDocuments[section] = {};
        //                     }
        //                     Object.entries(fileName).forEach(([Name, url]) => {

        //                         if (!groupedDocuments[section][Name]) {
        //                             groupedDocuments[section][Name] = [];
        //                         }
        //                         groupedDocuments[section][Name].push(url);
        //                     })
        //                 }
        //             });
        //         });

        //     });
        //     return { member: member.name, documents: groupedDocuments };
        // })

        return reply.status(200).send({
            candidateInfo,
            familyMembersInfo,
            housingInfo,
            vehicleInfoResults,
            familyMembersDiseases,
            familyMemberMedications,
            incomePerCapita,
            totalExpenses,
            majoracao,
            totalIncome,
            hasGreaterIncome,
            status: application.status,
            parecer,
            application: { number: application.number, name: application.announcement.announcementName, createdAt: application.createdAt, aditionalInfo: application.parecerAditionalInfo },
            documentsUrls: documentsFilteredByMember
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