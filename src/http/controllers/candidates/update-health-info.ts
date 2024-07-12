import { ForbiddenError } from "@/errors/forbidden-error"
import { NotAllowedError } from "@/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function updateHealthInfo(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const DiseaseType = z.enum([
      'ALIENATION_MENTAL',
      'CARDIOPATHY_SEVERE',
      'BLINDNESS',
      'RADIATION_CONTAMINATION',
      'PARKINSONS_DISEASE',
      'ANKYLOSING_SPONDYLITIS',
      'PAGETS_DISEASE',
      'HANSENS_DISEASE',
      'SEVERE_HEPATOPATHY',
      'SEVERE_NEPHROPATHY',
      'PARALYSIS',
      'ACTIVE_TUBERCULOSIS',
      'HIV_AIDS',
      'MALIGNANT_NEOPLASM',
      'TERMINAL_STAGE',
      'MICROCEPHALY',
      'AUTISM_SPECTRUM_DISORDER',
      'RARE_DISEASE',
      'OTHER_HIGH_COST_DISEASE',
    ])
  
    const healthDataSchema = z.object({
      specificDisease: z.string().optional(),
      hasMedicalReport: z.boolean(),
    })
  
    const healthParamsSchema = z.object({
      _id: z.string(),
    })
  
    const { _id } = healthParamsSchema.parse(request.params)
  
    const { hasMedicalReport, specificDisease } = healthDataSchema.parse(
      request.body,
    )
  
    try {
      const user_id = request.user.sub
      const IsUser = await SelectCandidateResponsible(user_id)
      if (!IsUser) {
        throw new NotAllowedError()
      }
      const disease = await prisma.familyMemberDisease.findUnique({
        where: { id: _id },
        select: { candidate_id: true , familyMember:true, legalResponsibleId: true}
      })
      if (!disease) {
        throw new ResourceNotFoundError()
      }
  
      const userOwner = disease.candidate_id || disease.legalResponsibleId || disease.familyMember?.candidate_id || disease.familyMember?.legalResponsibleId
      if (IsUser.UserData.id != userOwner) {
        throw new ForbiddenError()
      }
      await prisma.familyMemberDisease.update({
        where: {id :_id},
        data: {
          hasMedicalReport,
          specificDisease: specificDisease ? specificDisease : undefined,
        },
      })
      
      return reply.status(200).send()
  
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message })
      }
      if (err instanceof NotAllowedError) {
        return reply.status(401).send({ message: err.message })
      }
      if (err instanceof ForbiddenError) {
        return reply.status(403).send({ message: err.message })
        
      }
  
      return reply.status(500).send({ message: err.message })
    }
  }