import { SubsidiaryNotExistsError } from '@/errors/subsidiary-not-exists-error'
import { prisma } from '@/lib/prisma'
import STATES from '@/utils/enums/zod/state'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateSubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateDataSchema = z.object({
    name: z.string().optional(),
    socialReason: z.string().optional(),
    CEP: z.string().optional(),
    address: z.string().optional(),
    addressNumber: z.number().optional(),
    UF: STATES.optional(),
    city: z.string().optional(),
    educationalInstitutionCode: z.string().optional(),
  })
  const updateParamsSchema = z.object({
    _id: z.string(),
  })

  const updatedData = updateDataSchema.parse(request.body)

  const { _id } = updateParamsSchema.parse(request.params)

  try {
    const subsidiary = await prisma.entitySubsidiary.findUnique({
      where: { id: _id },
    })

    if (!subsidiary) {
      throw new SubsidiaryNotExistsError()
    }

    await prisma.entitySubsidiary.update({
      where: { id: _id },
      data: updatedData,
    })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof SubsidiaryNotExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
