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
    address: z.string(),
    phone: z.string(),
  })

  const { name, email, password, role, address, phone } =
    registerBodySchema.parse(request.body)

  try {
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

    await prisma.entity.create({
      data: {
        address,
        user_id: user.id,
        name,
        phone,
      },
    })
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }

  return reply.status(201).send()
}
