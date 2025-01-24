import { AssistantAlreadyExistsError } from '@/errors/already-exists-assistant-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
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
    CPF: z.string().transform(e => e.replace(/\D*/g, '')),
    RG: z.string(),
    CRESS: z.string(),
    phone: z.string(),
  })

  const { name, email, password, CPF, RG, CRESS, phone } =
    registerBodySchema.parse(request.body)

  try {
    // Verifica se já existe algum usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const userId = request.user.sub

    const entity = await prisma.entity.findUnique({
      where: { user_id: userId },
    })
    if (!entity) {
      throw new ResourceNotFoundError()
    }

    const assistantWithSameCPF = await prisma.socialAssistant.findUnique({
      where: { CPF, entity_id: entity.id },
    })
    if (assistantWithSameCPF) {
      throw new AssistantAlreadyExistsError()
    }

    const assistantWithSameRG = await prisma.socialAssistant.findUnique({
      where: { RG, entity_id: entity.id },
    })
    if (assistantWithSameRG) {
      throw new AssistantAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)
    const user = await prisma.user.create({
      data: {
        email,
        password: password_hash,
        role: 'ASSISTANT',
      },
    })

    // Cria a assitente associado a filial
    await prisma.socialAssistant.create({
      data: {
        user_id: user.id,
        name,
        CPF,
        phone,
        entity_id: entity.id,
        CRESS,
        RG,
      },
    })

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
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
