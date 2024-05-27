import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FamilyMember } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'





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

          const healthInfo: { disease?: any, medication: any[] }[] = familyMemberHealthInfo.map(disease => ({
            disease: disease,
            medication: disease.medications.map(medication => medication.medicationName)
          }))
          const familyMedicationInfo = await prisma.medication.findMany({
            where: { familyMember_id: familyMember.id }
          })
          familyMedicationInfo.forEach((med) => {
            healthInfo.push({ disease: null, medication: [med] })
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
      where: idField
    })
    const healthInfo: { disease?: any, medication: any[] }[] = candidateDisease.map(disease => ({
      disease: disease,
      medication: disease.medications.map(medication => medication.medicationName)
    }))

    // Need to get MEDICATIONS that DO NOT HAVE any disease registered :)
    candidateMedications.forEach((med) => {
      healthInfo.push({ disease: null, medication: [med] })
    })

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
