import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { historyDatabase } from '@/lib/prisma'
import { SelectCandidateResponsibleHDB } from '@/utils/select-candidate-responsibleHDB'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getSectionDocumentsPDF_HDB } from "../../social-assistant/AWS-routes/get-documents-by-section-HDB"

export async function getHealthInfoHDB(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    // O _id do familiar é opcional

    const AssistantParamsSchema = z.object({
        application_id: z.string(),
    })

    const { application_id } = AssistantParamsSchema.parse(request.params)
    try {
        // Verifica se existe um candidato associado ao user_id
        const candidateOrResponsible = await SelectCandidateResponsibleHDB(application_id)
        if (!candidateOrResponsible) {
            throw new ResourceNotFoundError()
        }


        const familyMembers = await historyDatabase.familyMember.findMany({
            where: { application_id: application_id },
        })

        async function fetchData(familyMembers: FamilyMember[]) {
            const healthInfoResults = []
            for (const familyMember of familyMembers) {
                try {
                    const familyMemberHealthInfo = await historyDatabase.familyMemberDisease.findMany({
                        where: { familyMember_id: familyMember.id },
                        include: { Medication: true }
                    })

                    const healthInfo: { id: string, disease?: any, specificDisease?: any, hasMedicalReport: boolean, medication: any[] }[] = familyMemberHealthInfo.map(disease => ({
                        id: disease.id,
                        disease: disease,
                        hasMedicalReport: disease.hasMedicalReport,
                        specificDisease: disease.specificDisease,
                        medication: disease.Medication
                    }))
                    const familyMedicationInfo = await historyDatabase.medication.findMany({
                        where: { familyMember_id: familyMember.id },
                        include: { FamilyMemberDisease: true }
                    })
                    familyMedicationInfo.forEach((med) => {
                        if (!med.FamilyMemberDisease) {

                            healthInfo.push({ id: med.id, disease: null, medication: [med], hasMedicalReport: false })
                        }
                    })
                    healthInfoResults.push({ name: familyMember.fullName, id: familyMember.id, healthInfo })
                } catch (error) {
                    throw new ResourceNotFoundError()
                }
            }
            return healthInfoResults
        }
        const candidateDisease = await historyDatabase.familyMemberDisease.findMany({
            where: { OR: [{ candidate_id: candidateOrResponsible.UserData.id }, { legalResponsibleId: candidateOrResponsible.UserData.id }] },
            include: { Medication: true }
        })
        const candidateMedications = await historyDatabase.medication.findMany({
            where: { OR: [{ candidate_id: candidateOrResponsible.UserData.id }, { legalResponsibleId: candidateOrResponsible.UserData.id }] },
            include: { FamilyMemberDisease: true }
        })
        const healthInfo: { id: string, disease?: any, specificDisease?: any, hasMedicalReport: boolean, medication: any[] }[] = candidateDisease.map(disease => ({
            id: disease.id,
            disease: disease,
            hasMedicalReport: disease.hasMedicalReport,
            specificDisease: disease.specificDisease,
            medication: disease.Medication
        }))

        // Need to get MEDICATIONS that DO NOT HAVE any disease registered :)
        candidateMedications.forEach((med) => {
            if (!med.FamilyMemberDisease) {
                healthInfo.push({ id: med.id, disease: null, medication: [med], hasMedicalReport: false })
            }

        })

        let healthInfoResults = await fetchData(familyMembers)


        healthInfoResults.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, healthInfo })
        const urlsHealth = await getSectionDocumentsPDF_HDB(application_id, 'health')
        const urlsMedication = await getSectionDocumentsPDF_HDB(application_id, 'medication')
        console.log(urlsMedication)
        const healthInfoResultsWithUrls = healthInfoResults.map((member) => {
            const healthInfoResultsUrls = member.healthInfo.map((disease) => {

                const healthDocuments = Object.entries(urlsHealth).filter(([url]) => url.split("/")[4] === disease.id)
                const medicationDocuments = Object.entries(urlsMedication).filter(([url]) => disease.medication.find(e => e.id === url.split("/")[4]))
                return {
                    ...disease,
                    urlsHealth: Object.fromEntries(healthDocuments),
                    urlsmedication: Object.fromEntries(medicationDocuments)
                }
            })
            return {
                ...member,
                healthInfoResultsUrls
            }
        })


        return reply.status(200).send({ healthInfoResultsWithUrls })
    } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }

        return reply.status(500).send({ message: err.message })
    }
}
