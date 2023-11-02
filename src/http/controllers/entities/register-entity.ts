import { NotAllowedError } from '@/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { ROLE } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerEntity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum([ROLE.ENTITY]),
    CNPJ: z.string(),
    logo: z.string(),
    socialReason: z.string(),
    CEP: z.string(),
    address: z.string(),
    educationalInstitutionCode: z.string().optional(),
  })

  const {
    name,
    email,
    password,
    role,
    CNPJ,
    logo,
    socialReason,
    CEP,
    address,
    educationalInstitutionCode,
  } = registerBodySchema.parse(request.body)

  try {
    // Verifica se já existe algum usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // Verifica se já existe alguma entidade com o mesmo CNPJ fornecido
    const entityWithSameCNPJ = await prisma.entity.findUnique({
      where: { CNPJ },
    })

    if (entityWithSameCNPJ) {
      throw new NotAllowedError()
    }

    const password_hash = await hash(password, 6)

    const user = await prisma.user.create({
      data: {
        email,
        password: password_hash,
        role,
      },
    })

    // Cria a entidade
    await prisma.entity.create({
      data: {
        user_id: user.id,
        name,
        CNPJ,
        logo,
        socialReason,
        address,
        CEP,
        educationalInstitutionCode,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
