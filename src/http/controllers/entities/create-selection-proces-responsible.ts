import { SubsidiaryDirectorAlreadyExistsError } from '@/errors/subsidiary-director-already-exists'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { ROLE } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createSelectionProcessResponsible(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
    role: z.enum([ROLE.SELECTION_RESPONSIBLE]),
    CPF: z.string(),
  })

  const registerParamsSchema = z.object({
    subsidiary_id: z.string(),
  })

  const { name, email, password, role, CPF, phone } = registerBodySchema.parse(
    request.body,
  )

  const { subsidiary_id } = registerParamsSchema.parse(request.params)
  try {
    // Verifica se já existe algum usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
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
    await prisma.selectionProcessResponsible.create({
      data: {
        user_id: user.id,
        name,
        CPF,
        phone,
        entity_subsidiary_id: subsidiary_id,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
