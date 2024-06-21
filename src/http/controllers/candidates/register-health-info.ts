import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerHealthInfo(
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
    diseases: z.array(DiseaseType),
    specificDisease: z.string().optional(),
    hasMedicalReport: z.boolean(),
  })

  const healthParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === familyMemberId
  const { _id } = healthParamsSchema.parse(request.params)

  const { diseases, hasMedicalReport, specificDisease } = healthDataSchema.parse(
    request.body,
  )

  try {
    const user_id = request.user.sub
    // const IsUser = await SelectCandidateResponsible(user_id)
    // if (!IsUser) {
    //   throw new NotAllowedError()
    // }
    const CandidateOrResponsible = await SelectCandidateResponsible(_id)
    if (!CandidateOrResponsible) {
      const familyMember = await prisma.familyMember.findUnique({
        where: { id: _id },
      })
      if (!familyMember) {
        throw new ResourceNotFoundError()
      }
    }

    const idField = CandidateOrResponsible ? (CandidateOrResponsible.IsResponsible ? { legalResponsibleId: _id } : { candidate_id: _id }) : { familyMember_id: _id }

    const { id } = await prisma.familyMemberDisease.create({
      data: {
        hasMedicalReport,
        diseases,
        specificDisease: specificDisease ? specificDisease : undefined,
        ...idField,

      },
    })

    if (CandidateOrResponsible) {
      await prisma.identityDetails.update({
        where: (CandidateOrResponsible!.IsResponsible ? { responsible_id: CandidateOrResponsible!.UserData.id } : { candidate_id: CandidateOrResponsible!.UserData.id }),
        data: { hasSevereDesease: true }
      })
    }
    return reply.status(201).send({ id })

  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
