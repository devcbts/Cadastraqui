import { NotAllowedError } from '@/errors/not-allowed-error'
import { SubsidiaryNotExistsError } from '@/errors/subsidiary-not-exists-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteSubsidiary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    _id: z.string().optional(),
  })

  const { _id } = deleteParamsSchema.parse(request.params)

  try {
    const user_id = request.user.sub

    const entity = await prisma.entity.findUnique({
        where: {user_id}
    })
    if (!entity) {
        throw new NotAllowedError()
    }


    const subsidiary = await prisma.entitySubsidiary.findUnique({
      where: { id: _id },
    })

    if (!subsidiary) {
      throw new SubsidiaryNotExistsError()
    }

    // Falta deletar os usuários relacionados com os diretores excluídos
    
    await prisma.entitySubsidiary.delete({ where: { id: _id } })

    await prisma.user.delete({ where: { id: subsidiary.user_id } })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof SubsidiaryNotExistsError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
  }

    return reply.status(500).send({ message: err.message })
  }
}
