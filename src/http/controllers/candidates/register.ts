import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
    CPF: z.string().transform(e => e.replace(/\D*/g, '')),
    birthDate: z.string(),
  })

  const {
    name,
    email,
    password,
    CPF,
    birthDate,
  } = registerBodySchema.parse(request.body)

  try {
    // Verifica se já existe um usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })
    const candidateWithSameCPF = await prisma.candidate.findUnique({
      where: { CPF },
    })
    console.log(request.body)

    if (userWithSameEmail || candidateWithSameCPF) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: password_hash,
        role: 'CANDIDATE',
      },
    })

    // Cria candidato
    const candidate = await prisma.candidate.create({
      data: {
        CPF,
        birthDate: new Date(birthDate),
        user_id: user.id,
        name,
        email,
      },
    })


    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
