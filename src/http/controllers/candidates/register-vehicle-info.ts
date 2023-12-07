import { NotAllowedError } from '@/errors/not-allowed-error'
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
    owners_id: z.array(z.string()),
    candidate_id: z.string().optional(),
  })

  console.log('====================================');
  console.log(request.body);
  console.log('====================================');
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
    candidate_id
  } = vehicleDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    const familyMembersExist = await Promise.all(
      owners_id.map(owner_id =>
        prisma.familyMember.findUnique({
          where: { id: owner_id },
          select: { id: true } // Seleciona apenas o ID para verificação
        })
      )
    );
  
    if (familyMembersExist.some(member => member === null)) {
      throw new NotAllowedError();
    }
  
    // Armazena informações acerca do veículo no banco de dados
    const vehicle = await prisma.vehicle.create({
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
        candidate: candidate_id ? { connect: { id: candidate_id } } : undefined,
        // Não adiciona os proprietários aqui, pois será feito no próximo passo
      },
    });
  
    // Associa os membros da família ao veículo
    await Promise.all(
      owners_id.map(owner_id => 
        prisma.familyMemberToVehicle.create({
          data: {
            A: owner_id,
            B: vehicle.id
          }
        })
      )
    );

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
