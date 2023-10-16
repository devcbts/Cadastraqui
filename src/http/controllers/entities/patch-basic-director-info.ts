import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function patchDirector(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    CPF: z.string().optional(),
  })

  const updateParamsSchema = z.object({
    _id: z.string(),
    director_id: z.string(),
  })

  const { name, email, CPF, phone } = updateBodySchema.parse(request.body)
  const updateData = { name, CPF, phone }

  const dataToUpdate: Record<string, any> = {}
  for (const key in updateData) {
    if (typeof updateData[key as keyof typeof updateData] !== 'undefined') {
      dataToUpdate[key as keyof typeof updateData] = updateData[key as keyof typeof updateData];
    }
  }
  // Pegar o id da entidade (ou subsidiária) e do diretor
  const { _id, director_id } = updateParamsSchema.parse(request.params)
  try {


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
        data: dataToUpdate,
        where: { id: director_id },
      })

      return reply.status(201).send()
    }

    // Atualiza o diretor associado a matriz
    await prisma.entityDirector.update({
      data: dataToUpdate,
      where: { id: director_id },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
