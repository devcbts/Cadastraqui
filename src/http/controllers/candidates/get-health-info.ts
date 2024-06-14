import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getSectionDocumentsPDF } from './AWS Routes/get-pdf-documents-by-section'





export async function getHealthInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O _id do familiar é opcional


  try {
    const user_id = request.user.sub
    let candidateOrResponsible
    let idField

    // Verifica se existe um candidato associado ao user_id
    candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }
    idField = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }


    const familyMembers = await prisma.familyMember.findMany({
      where: idField,
    })

    async function fetchData(familyMembers: FamilyMember[]) {
      const healthInfoResults = []
      for (const familyMember of familyMembers) {
        try {
          const familyMemberHealthInfo = await prisma.familyMemberDisease.findMany({
            where: { familyMember_id: familyMember.id },
            include: { medications: true }
          })

          const healthInfo: { id: string, disease?: any, specificDisease?: any, hasMedicalReport: boolean, medication: any[] }[] = familyMemberHealthInfo.map(disease => ({
            id: disease.id,
            disease: disease,
            hasMedicalReport: disease.hasMedicalReport,
            specificDisease: disease.specificDisease,
            medication: disease.medications.map(medication => medication.medicationName)
          }))
          const familyMedicationInfo = await prisma.medication.findMany({
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
    const candidateDisease = await prisma.familyMemberDisease.findMany({
      where: idField,
      include: { medications: true }
    })
    const candidateMedications = await prisma.medication.findMany({
      where: idField,
      include: { FamilyMemberDisease: true }
    })
    const healthInfo: { id: string, disease?: any, specificDisease?: any, hasMedicalReport: boolean, medication: any[] }[] = candidateDisease.map(disease => ({
      id: disease.id,
      disease: disease,
      hasMedicalReport: disease.hasMedicalReport,
      specificDisease: disease.specificDisease,
      medication: disease.medications.map(medication => medication.medicationName)
    }))

    // Need to get MEDICATIONS that DO NOT HAVE any disease registered :)
    candidateMedications.forEach((med) => {
      if (!med.FamilyMemberDisease) {
        healthInfo.push({ id: med.id, disease: null, medication: [med], hasMedicalReport: false })
      }

    })

    let healthInfoResults = await fetchData(familyMembers)


    healthInfoResults.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, healthInfo })
    const urlsHealth = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'health')
    const urlsMedication = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, 'medication')
    const healthInfoResultsWithUrls = healthInfoResults.map((member) => {
      const healthInfoResultsUrls = member.healthInfo.map((disease) => {

        const healthDocuments = Object.entries(urlsHealth).filter(([url]) => url.split("/")[4] === disease.id)
        const medicationDocuments = Object.entries(urlsMedication).filter(([url]) => url.split("/")[4] === disease.id)
        return {
          ...disease,
          urlsHealth: Object.fromEntries(healthDocuments),
          urlsmedication: Object.fromEntries(medicationDocuments)
        }
      })
      return {
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
