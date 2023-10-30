import { AssistantAlreadyExistsError } from '@/errors/already-exists-assistant-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerAssistant(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    CPF: z.string(),
    RG: z.string(),
    entity_id: z.string(),
    entity_subsidiary_id: z.string().optional(),
    CRESS: z.string(),
    phone: z.string(),
  })

  const {
    name,
    email,
    password,
    CPF,
    RG,
    entity_id,
    entity_subsidiary_id,
    CRESS,
    phone,
  } = registerBodySchema.parse(request.body)

  try {
    // Verifica se já existe um usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    // Cria usuário

    const assistantWithSameCPF = await prisma.socialAssistant.findUnique({
      where: { CPF },
    })
    if (assistantWithSameCPF) {
      throw new AssistantAlreadyExistsError()
    }

    const entity = await prisma.entity.findUnique({ where: { id: entity_id } })

    if (!entity) {
      throw new NotAllowedError()
    }

    let subsidiary
    if (entity_subsidiary_id) {
      subsidiary = await prisma.entitySubsidiary.findUnique({
        where: { id: entity_subsidiary_id },
      })
    }

    if (subsidiary) {
      // Cria usuário
      const user = await prisma.user.create({
        data: {
          email,
          password: password_hash,
          role: 'ASSISTANT',
        },
      })
      console.log('teste')
      // Cria assistente social
      await prisma.socialAssistant.create({
        data: {
          CPF,
          user_id: user.id,
          name,
          entity_id,
          entity_subsidiary: {
            connect: { id: entity_subsidiary_id },
          },
          RG,
          phone,
          CRESS,
        },
        include: {
          entity_subsidiary: true,
        },
      })
    } else {
      // cria usuário
      const user = await prisma.user.create({
        data: {
          email,
          password: password_hash,
          role: 'ASSISTANT',
        },
      })
      // cria assistente social
      await prisma.socialAssistant.create({
        data: {
          CPF,
          user_id: user.id,
          name,
          entity_id,
          RG,
          phone,
          CRESS,
        },
      })
    }

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof AssistantAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
