import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function patchHousingInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const PropertyStatus = z.enum([
    'OwnPaidOff',
    'OwnFinanced',
    'Rented',
    'ProvidedByEmployer',
    'ProvidedByFamily',
    'ProvidedOtherWay',
    'Irregular',
  ])
  const ContractType = z.enum([
    'Verbal',
    'ThroughRealEstateAgency',
    'DirectWithOwner',
  ])
  const TimeLivingInProperty = z.enum([
    'UpTo11Months',
    'From1To10Years',
    'From10To20Years',
    'Over20Years',
  ])
  const DomicileType = z.enum([
    'House',
    'CondominiumHouse',
    'Apartment',
    'RoomingHouse',
  ])
  const NumberOfRooms = z.enum([
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
  ])

  const housingDataSchema = z.object({
    grantorName: z.string(),
    propertyStatus: PropertyStatus,
    contractType: ContractType,
    timeLivingInProperty: TimeLivingInProperty,
    domicileType: DomicileType,
    numberOfRooms: NumberOfRooms,
    numberOfBedrooms: z.number(),
  })

  const {
    contractType,
    domicileType,
    grantorName,
    numberOfBedrooms,
    numberOfRooms,
    propertyStatus,
    timeLivingInProperty,
  } = housingDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    if (!user_id) {
      throw new NotAllowedError()
    }

    const candidate = await prisma.candidate.findUnique({ where: { user_id } })

    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    const candidateHousingInfo = await prisma.housing.findUnique({
      where: { candidate_id: candidate.id },
    })
    // Analisa se o candidato não possui cadastro de moradia
    if (!candidateHousingInfo) {
      throw new ResourceNotFoundError()
    }

    // Armazena informações acerca da moradia no banco de dados
    await prisma.housing.update({
      data: {
        contractType,
        domicileType,
        grantorName,
        numberOfBedrooms,
        numberOfRooms,
        propertyStatus,
        timeLivingInProperty,
      },
      where: {candidate_id: candidate.id}
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
