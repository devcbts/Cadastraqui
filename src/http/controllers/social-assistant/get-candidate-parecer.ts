import { ForbiddenError } from "@/errors/forbidden-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { historyDatabase, prisma } from "@/lib/prisma";
import { calculateAge } from "@/utils/calculate-age";
import { CalculateIncomePerCapitaHDB } from "@/utils/Trigger-Functions/calculate-income-per-capita-HDB";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getSectionDocumentsPDF_HDB } from "./AWS-routes/get-documents-by-section-HDB";

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
                candidate: true
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
        const { incomePerCapita, incomesPerMember } = await CalculateIncomePerCapitaHDB(application_id)
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

        }

        const familyMembers = await historyDatabase.familyMember.findMany({
            where: { application_id }
        })

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
            const ownerNames = vehicle.owners_id.map(id => familyMemberNames[id]);
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
                disease: disease.disease,
                hasMedicalReport: disease.hasMedicalReport,
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

        const importantInfo = {
            cadUnico: identityDetails.CadUnico,
            familyIncome: incomePerCapita * (familyMembers.length + 1),
            familyExpenses: expenses ? expenses.reduce((acc, expense) => acc + expense.totalExpense!, 0) / (expenses.length) : 0,
            hasSevereDisease: application.hasSevereDesease,
            housingSituation: housingInfo?.propertyStatus,
            vehiclesCount: vehicles.length,
            distance: application.distance,
        }
        const documentsUrls = section.map(async (section) => {
            return {
                [section]: await getSectionDocumentsPDF_HDB(application_id, section)
            }
        })

        return reply.status(200).send({
            candidateInfo,
            familyMembersInfo,
            housingInfo,
            vehicleInfoResults,
            familyMembersDiseases,
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