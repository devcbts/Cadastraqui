import { ForbiddenError } from "@/errors/forbidden-error"
import { prisma } from "@/lib/prisma"
import { SelectCandidateResponsible } from "@/utils/select-candidate-responsible"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function updateVehicleInfo(
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

  const VehicleParamsSchema = z.object({
    _id: z.string(),
  })
  const vehicleDataSchema = z.object({
    vehicleType: VehicleType,
    modelAndBrand: z.string(),
    manufacturingYear: z.number(),
    situation: VehicleSituation,
    financedMonths: z.number(),
    monthsToPayOff: z.number(),
    hasInsurance: z.boolean(),
    insuranceValue: z.number(),
    usage: VehicleUsage,
    owners_id: z.array(z.string()),
  }).partial()

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
    owners_id,
  } = vehicleDataSchema.parse(request.body)

  const { _id } = VehicleParamsSchema.parse(request.params)
  try {
    const user_id = request.user.sub;

    const candidateResponsible = await SelectCandidateResponsible(user_id)

    if (!candidateResponsible) {
      throw new ForbiddenError()
    }
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: _id },
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
        owners_id,
      },
    });

    return reply.status(200).send({ updatedVehicle })
  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}