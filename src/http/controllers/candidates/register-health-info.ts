import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
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

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o family_member_id
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })
    if (!familyMember) {
      throw new NotAllowedError()
    }

    // Armazena informações acerca do veículo no banco de dados
    await prisma.familyMemberDisease.create({
      data: {
        hasMedicalReport,
        familyMember_id: familyMember.id,
        diseases,
        specificDisease : specificDisease? specificDisease : undefined,
      },
    })

    return reply.status(201).send()
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
