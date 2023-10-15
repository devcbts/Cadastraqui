import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createDirector(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
    CPF: z.string(),
  })

  const registerParamsSchema = z.object({
    _id: z.string(),
  })

  const { name, email, password, CPF, phone } = registerBodySchema.parse(
    request.body,
  )

  const { _id } = registerParamsSchema.parse(request.params)
  try {
    // Verifica se já existe algum usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const matriz = await prisma.entity.findUnique({ where: { id: _id } })
    if (!matriz) {
      const subsidiary = await prisma.entitySubsidiary.findUnique({
        where: { id: _id },
      })

      if (!subsidiary) {
        throw new ResourceNotFoundError()
      }

      const password_hash = await hash(password, 6)
      const user = await prisma.user.create({
        data: {
          email,
          password: password_hash,
          role: 'ENTITY_DIRECTOR',
        },
      })

      // Cria o diretor associado a filial
      await prisma.entityDirector.create({
        data: {
          user_id: user.id,
          name,
          CPF,
          phone,
          entity_subsidiary_id: _id,
        },
      })

      return reply.status(201).send()
    }

    const password_hash = await hash(password, 6)
    const user = await prisma.user.create({
      data: {
        email,
        password: password_hash,
        role: 'ENTITY_DIRECTOR',
      },
    })

    // Cria o diretor associado a matriz
    await prisma.entityDirector.create({
      data: {
        user_id: user.id,
        name,
        CPF,
        phone,
        entity_id: _id,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
