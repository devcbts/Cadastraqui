import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerLegalResponsible(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    CEP: z.string(),
    CPF: z.string(),
    address: z.string(),
    birthDate: z.string(),
    phone: z.string(),
    city: z.string(),
    neighborhood: z.string(),
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
    addressNumber: z.string(),
  })

  const {
    name,
    email,
    password,
    CEP,
    CPF,
    UF,
    address,
    city,
    neighborhood,
    phone,
    addressNumber,
    birthDate,
  } = registerBodySchema.parse(request.body)

  try {
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })
    const userWithSameCPF = await prisma.legalResponsible.findUnique({
      where: { CPF }
    })
    if (userWithSameEmail || userWithSameCPF) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await prisma.user.create({
      data: {
        email,
        password: password_hash,
        role: 'RESPONSIBLE',
      },
    })

    const responsible = await prisma.legalResponsible.create({
      data: {
        address,
        CEP,
        city,
        CPF,
        birthDate: new Date(birthDate),
        neighborhood,
        addressNumber,
        user_id: user.id,
        phone,
        UF,
        name,
      },
    })
    const responsible_id = responsible.id
    return reply.status(201).send({ responsible_id })
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
