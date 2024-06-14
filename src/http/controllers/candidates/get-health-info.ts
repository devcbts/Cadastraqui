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

          const healthInfo: { disease?: any, medication: any[], urls: any }[] = await Promise.all(familyMemberHealthInfo.map(async disease => ({
            disease: disease,
            medication: disease.medications,
            urls: await getSectionDocumentsPDF(candidateOrResponsible!.UserData.id, `health/${disease.id}`)
          })))
          const familyMedicationInfo = await prisma.medication.findMany({
            where: { familyMember_id: familyMember.id }
          })

          await Promise.all(familyMedicationInfo.map(async (med) => {
            if (med.familyMemberDiseaseId === null) {
              healthInfo.push({ disease: null, medication: [med], urls: await getSectionDocumentsPDF(candidateOrResponsible!.UserData.id, `medication/${med.id}`) })
            }
          }))
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
      where: idField
    })
    const healthInfo: { disease?: any, medication: any[], urls: any }[] = await Promise.all(candidateDisease.map(async disease => ({
      disease: disease,
      medication: disease.medications,
      urls: await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, `health/${disease.id}`)
    })))
    // Need to get MEDICATIONS that DO NOT HAVE any disease registered :)
    await Promise.all(candidateMedications.map(async (med) => {
      if (med.familyMemberDiseaseId === null) {
        const urls = await getSectionDocumentsPDF(candidateOrResponsible.UserData.id, `medication/${med.id}`)
        healthInfo.push({ disease: null, medication: [med], urls })
      }
    }))

    let healthInfoResults = await fetchData(familyMembers)


    healthInfoResults.push({ name: candidateOrResponsible.UserData.name, id: candidateOrResponsible.UserData.id, healthInfo })


    return reply.status(200).send({ healthInfoResults })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
