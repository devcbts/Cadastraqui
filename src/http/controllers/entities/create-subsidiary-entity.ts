import { EntityMatrixAlreadyExistsError } from '@/errors/already-exists-entity-matrix-error'
import { EntityMatrixNotExistsError } from '@/errors/entity-matrix-not-exists-errror'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createEntitySubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    entity_matrix_id: z.string(),
    CEP: z.string(),
    city: z.string(),
    code: z.string(),
    CNPJ: z.string(),
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
    addressStreet: z.string(),
  })

  const {
    CEP,
    UF,
    addressComplement,
    city,
    neighborhood,
    addressNumber,
    CNPJ,
    name,
    code,
    addressStreet,
    entity_matrix_id,
  } = registerBodySchema.parse(request.body)

  try {
    const entityMatrix = await prisma.entityMatrix.findUnique({
      where: { id: entity_matrix_id },
    })

    if (!entityMatrix) {
      throw new EntityMatrixNotExistsError()
    }

    await prisma.entitySubsidiary.create({
      data: {
        addressNumber,
        CEP,
        city,
        neighborhood,
        UF,
        addressComplement,
        CNPJ,
        code,
        name,
        entity_matrix_id,
        addressStreet,
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
