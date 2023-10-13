import { EntityNotExistsError } from '@/errors/entity-not-exists-error'
import { EntitySubsidiaryAlreadyExistsError } from '@/errors/entity-subsidiary-already-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createSubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    CEP: z.string(),
    educationalInstitutionCode: z.string().optional(),
    socialReason: z.string(),
    CNPJ: z.string(),
    address: z.string(),
  })

  const {
    CEP,
    CNPJ,
    address,
    email,
    password,
    name,
    socialReason,
    educationalInstitutionCode,
  } = registerBodySchema.parse(request.body)

  try {
    // Verifica se existe um usuário com o id armazenado no JWT
    const userId = request.user.sub

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

    // Verifica se já existe um usuário com o email fornecido
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      throw new UserAlreadyExistsError()
    }

    // Verifica se já existe uma filial com o CNPJ fornecido
    const entitySubsidiary = await prisma.entitySubsidiary.findUnique({
      where: { CNPJ },
    })

    if (entitySubsidiary) {
      throw new EntitySubsidiaryAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    // Cria um usuário para a filial
    await prisma.user.create({
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
        socialReason,
        entity_id: entity.id,
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

    return reply.status(500).send({ message: err.message })
  }
}
