import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerOthersInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const EmploymentType = z.enum([
    'PRIVATE_EMPLOYEE_CLT',
    'PUBLIC_EMPLOYEE',
    'DOMESTIC_EMPLOYEE',
    'TEMPORARY_RURAL_WORKER',
    'RETIRED',
    'PENSIONER',
    'APPRENTICE_INTERN',
    'TEMPORARY_DISABILITY_BENEFIT',
  ])

  const OthersDataSchema = z.object({
    employmentType: EmploymentType,
    admissionDate: z.string(),
    position: z.string().optional(),
    payingSource: z.string().optional(),
    payingSourcePhone: z.string().optional(),
  })

  const OthersDataParamsSchema = z.object({
    _id: z.string(),
  })

  // _id === family_member_id
  const { _id } = OthersDataParamsSchema.parse(request.params)

  const {
    admissionDate,
    employmentType,
    payingSource,
    payingSourcePhone,
    position,
  } = OthersDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o owner_id
    const familyMember = await prisma.familyMember.findUnique({
      where: { id: _id },
    })
    if (!familyMember) {
      throw new NotAllowedError()
    }

    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: { familyMember_id: _id },
    })

    const totalAmount = monthlyIncomes.reduce((acc, current) => {
      return acc + (current.liquidAmount || 0)
    }, 0)

    const avgIncome = totalAmount / monthlyIncomes.length

    // Armazena informações acerca do Empresário no banco de dados
    await prisma.familyMemberIncome.create({
      data: {
        employmentType,
        averageIncome: avgIncome.toString(),
        familyMember_id: _id,
        payingSourcePhone,
        payingSource,
        position,
        admissionDate,
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
