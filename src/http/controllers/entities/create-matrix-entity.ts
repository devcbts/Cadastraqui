import { EntityMatrixAlreadyExistsError } from '@/errors/already-exists-entity-matrix-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createEntityMatrix(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    CEP: z.string(),
    city: z.string(),
    UF: z.enum([
      'AC',
      'AL',
      'AM',
      'AP',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MG',
      'MS',
      'MT',
      'PA',
      'PB',
      'PE',
      'PI',
      'PR',
      'RJ',
      'RN',
      'RO',
      'RR',
      'RS',
      'SC',
      'SE',
      'SP',
      'TO',
    ]),
    neighborhood: z.string(),
    addressComplement: z.string(),
    addressNumber: z.string(),
    publicPlace: z.string(),
    entity_id: z.string(),
    educationalInstitutionCode: z.string(),
    educationalArea: z.boolean(),
  })

  const {
    CEP,
    UF,
    addressComplement,
    city,
    neighborhood,
    addressNumber,
    publicPlace,
    educationalInstitutionCode,
    entity_id,
    educationalArea,
  } = registerBodySchema.parse(request.body)

  try {
    const entityMatrix = await prisma.entityMatrix.findUnique({
      where: { entity_id },
    })

    if (!entityMatrix) {
      throw new EntityMatrixAlreadyExistsError()
    }

    await prisma.entityMatrix.create({
      data: {
        addressNumber,
        CEP,
        city,
        neighborhood,
        publicPlace,
        UF,
        educationalArea,
        addressComplement,
        educationalInstitutionCode,
        entity_id,
      },
    })
  } catch (err: any) {
    if (err instanceof EntityMatrixAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }

  return reply.status(201).send()
}
