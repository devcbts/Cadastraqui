import { LegalResponsibleNotExistsError } from '@/errors/legal-responsible-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
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
    date_of_birth: z.string(),
    user_id: z.string(),
  })

  const { CPF, date_of_birth, name, user_id } = registerBodySchema.parse(
    request.body,
  )

  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    })

    if (!user) {
      throw new UserNotExistsError()
    }

    if (user.role !== 'RESPONSIBLE') {
      throw new NotAllowedError()
    }

    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id },
    })

    if (!responsible) {
      throw new LegalResponsibleNotExistsError()
    }

    await prisma.candidate.create({
      data: {
        address: responsible.address,
        CEP: responsible.CEP,
        city: responsible.city,
        CPF,
        date_of_birth: new Date(date_of_birth),
        name,
        neighborhood: responsible.neighborhood,
        number_of_address: responsible.number_of_address,
        phone: responsible.phone,
        UF: responsible.UF,
        responsible_id: responsible.id,
      },
    })
  } catch (err: any) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof LegalResponsibleNotExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(405).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }

  return reply.status(201).send()
}
