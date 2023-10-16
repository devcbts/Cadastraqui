import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function patchBasicsCandidateInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userType = request.user.role
    const userId = request.user.sub

    const updateBodySchema = z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        UF: z.enum([
            'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
            'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
        ]).optional(),
        CEP: z.string().optional(),
        neighborhood: z.string().optional(),
        addressNumber: z.number().optional(),
    })

    if (userType !== 'CANDIDATE') {
      throw new NotAllowedError()
    }

    const updateData = updateBodySchema.parse(request.body)

    const user = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    if (!user) {
      throw new NotAllowedError()
    }

    // Construindo o objeto de atualização dinamicamente
    const dataToUpdate: Record<string, any> = {}
    for (const key in updateData) {
      if (typeof updateData[key as keyof typeof updateData] !== 'undefined') {
        dataToUpdate[key as keyof typeof updateData] = updateData[key as keyof typeof updateData];
      }
    }

    await prisma.candidate.update({
        where: { user_id: userId },
        data: dataToUpdate,
    })

    return reply.status(200).send({ message: "dados atualizados com sucesso!" })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
