import { NotAllowedError } from '@/errors/not-allowed-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'
export async function updateBasicsCandidateInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userType = request.user.role
    const userId = request.user.sub

    const updateBodySchema = z.object({
        name : z.string(),
        phone : z.string(),
        address : z.string(),
        city: z.string(),
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
        CEP : z.string(),
        neighborhood : z.string(),
        addressNumber: z.number(),

    })

    if (userType !== 'CANDIDATE') {
      throw new NotAllowedError()
    }
    const {
        name,
        phone,
        address,
        city,
        UF,
        CEP,
        neighborhood,
        addressNumber,
    } = updateBodySchema.parse(request.body)

    const user = await prisma.candidate.findUnique({
      where: { user_id: userId },
    })

    if (!user) {
      throw new NotAllowedError()
    }

    await prisma.candidate.update({
        where: { user_id: userId },
        data:{
            name,
            phone,
            address,
            city,
            UF,
            CEP,
            neighborhood,
            addressNumber,
        },
        
    })

    return reply.status(200).send({message: "dados atualizados com sucesso!"})
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
