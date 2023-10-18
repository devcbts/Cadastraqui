import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerVehicleInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const VehicleType = z.enum([
    'SmallCarsAndUtilities',
    'TrucksAndMinibuses',
    'Motorcycles',
  ])
  const VehicleSituation = z.enum(['PaidOff', 'Financed'])
  const VehicleUsage = z.enum(['WorkInstrument', 'NecessaryDisplacement'])

  const vehicleDataSchema = z.object({
    vehicleType: VehicleType,
    modelAndBrand: z.string(),
    manufacturingYear: z.number(),
    situation: VehicleSituation,
    financedMonths: z.number().optional(),
    monthsToPayOff: z.number().optional(),
    hasInsurance: z.boolean().default(false),
    insuranceValue: z.number().optional(),
    usage: VehicleUsage,
    owner_id: z.string(),
  })

  const {
    hasInsurance,
    manufacturingYear,
    modelAndBrand,
    situation,
    usage,
    vehicleType,
    financedMonths,
    insuranceValue,
    monthsToPayOff,
    owner_id,
  } = vehicleDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se existe um familiar cadastrado com o owner_id

    const vehicleOwner = await prisma.familyMember.findFirst({
      where: { candidate_id: candidate.id, id: owner_id },
    })
    if (!vehicleOwner) {
      throw new ResourceNotFoundError()
    }

    // Armazena informações acerca do veículo no banco de dados
    await prisma.vehicle.create({
      data: {
        manufacturingYear,
        modelAndBrand,
        situation,
        usage,
        vehicleType,
        financedMonths,
        hasInsurance,
        insuranceValue,
        monthsToPayOff,
        owner_id,
      },
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
