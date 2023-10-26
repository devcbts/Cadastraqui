import { LegalResponsibleNotExistsError } from '@/errors/legal-responsible-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { UserNotExistsError } from '@/errors/users-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createLegalDependent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    CPF: z.string(),
    birthDate: z.string(),
    user_id: z.string(),
  })

  const { CPF, birthDate, name, user_id } = registerBodySchema.parse(
    request.body,
  )

  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    })

    if (!user) {
      throw new NotAllowedError()
    }

    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id },
    })

    if (!responsible) {
      throw new ResourceNotFoundError()
    }

    await prisma.candidate.create({
      data: {
        address: responsible.address,
        CEP: responsible.CEP,
        city: responsible.city,
        CPF,
        birthDate: new Date(birthDate),
        name,
        neighborhood: responsible.neighborhood,
        addressNumber: responsible.addressNumber,
        phone: responsible.phone,
        UF: responsible.UF,
        responsible_id: responsible.id,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
