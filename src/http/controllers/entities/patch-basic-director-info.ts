import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function patchDirector(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    CPF: z.string(),
  })

  const updateParamsSchema = z.object({
    _id: z.string(),
  })

  const { name, email, CPF, phone } = updateBodySchema.parse(request.body)

  const { _id } = updateParamsSchema.parse(request.params)
  try {
    // Verifica se já existe algum usuário com o email fornecido
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })
    // Se não existir usuário
    if (!userWithSameEmail) {
      throw new ResourceNotFoundError()
    }

    const matriz = await prisma.entity.findUnique({ where: { id: _id } })
    if (!matriz) {
      const subsidiary = await prisma.entitySubsidiary.findUnique({
        where: { id: _id },
      })

      if (!subsidiary) {
        throw new ResourceNotFoundError()
      }

      // Atualiza o diretor associado a filial
      await prisma.entityDirector.update({
        data: {
          name,
          CPF,
          phone,
        },
        where: { CPF },
      })

      return reply.status(201).send()
    }

    // Atualiza o diretor associado a matriz
    await prisma.entityDirector.update({
      data: {
        name,
        CPF,
        phone,
      },
      where: { CPF },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
