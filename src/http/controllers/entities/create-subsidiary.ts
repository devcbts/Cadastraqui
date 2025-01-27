import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { EntitySubsidiaryAlreadyExistsError } from '@/errors/entity-subsidiary-already-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import STATES from '@/utils/enums/zod/state'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { normalizeString } from './utils/normalize-string'
import SelectEntityOrDirector from './utils/select-entity-or-director'

export async function createSubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().optional().default("not_required_password"),
    CEP: z.string(),
    educationalInstitutionCode: z.string().optional(),
    socialReason: z.string(),
    CNPJ: z.string(),
    address: z.string(),
    addressNumber: z.string().transform((value) => parseInt(value)),
    city: z.string(),
    UF: STATES,
    neighborhood: z.string(),
  })

  const {
    CEP,
    CNPJ,
    address,
    email,
    password,
    name,
    socialReason,
    neighborhood,
    city,
    UF,
    addressNumber,
    educationalInstitutionCode,
  } = registerBodySchema.parse(request.body)

  try {
    // Verifica se existe um usuário com o id armazenado no JWT
    const { sub, role } = request.user
    const { user_id: userId } = await SelectEntityOrDirector(sub, role)
    console.log(userId)

    if (!userId) {
      throw new NotAllowedError()
    }

    // Verifica se existe uma entidade com id armazenado no JWT
    const entity = await prisma.entity.findUnique({
      where: { user_id: userId },
    })

    if (!entity) {
      throw new EntityNotExistsError()
    }

    const compareCnpjFields = (entitycnpj: string, subcnpj: string) => {
      const nondigits = /\D/g
      const entitycnpjdigits = entitycnpj.replace(nondigits, '')
      const subcnpjdigits = subcnpj.replace(nondigits, '')
      return (
        entitycnpjdigits.substring(0, 8) === subcnpjdigits.substring(0, 8)
        && subcnpjdigits.substring(8, 12) !== '0001'
      )
    }
    if (!compareCnpjFields(entity.CNPJ, CNPJ)) {
      return reply.status(400).send({ message: 'CNPJ para filial inválido' })
    }
    // Verifica se já existe um usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const normalizedCnpj = normalizeString(CNPJ)
    // Verifica se já existe uma filial com o CNPJ fornecido
    const entitySubsidiary = await prisma.entitySubsidiary.findUnique({
      where: { CNPJ },
    })

    if (entitySubsidiary) {
      throw new EntitySubsidiaryAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    // Cria um usuário para a filial
    const user = await prisma.user.create({
      data: {
        email,
        password: password_hash,
        role: 'ENTITY_SUB',
      },
    })

    // Cria uma filial associada a entidade principal
    await prisma.entitySubsidiary.create({
      data: {
        CEP,
        CNPJ,
        educationalInstitutionCode,
        name,
        address,
        addressNumber,
        city,
        neighborhood,
        socialReason,
        UF,
        entity_id: entity.id,
        user_id: user.id,
        normalizedCnpj
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof EntityNotExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof EntitySubsidiaryAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
