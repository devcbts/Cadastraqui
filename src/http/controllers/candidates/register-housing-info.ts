import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerHousingInfo(
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
    grantorName: z.string().optional(),
    propertyStatus: PropertyStatus,
    contractType: ContractType.optional(),
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
    const role = request.user.role
    if (role === 'RESPONSIBLE') {
      const responsible = await prisma.legalResponsible.findUnique({
        where: {user_id}
      })
      if (!responsible) {
        throw new NotAllowedError()
      }
      const dataToCreate = {
        domicileType,
        
        numberOfBedrooms,
        numberOfRooms,
        propertyStatus,
        timeLivingInProperty,
        responsible_id: responsible.id,
        ...(contractType && {contractType}),
        ...(grantorName && {grantorName})
      }
      await prisma.housing.create({
        data: dataToCreate
        
      })
  
      return reply.status(201).send()
    }
    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Analisa se o candidato já possui cadastro de moradia
    const candidateHousingInfo = await prisma.housing.findUnique({
      where: { candidate_id: candidate.id },
    })
    if (candidateHousingInfo) {
      throw new NotAllowedError()
    }

    const dataToCreate = {
      domicileType,
      
      numberOfBedrooms,
      numberOfRooms,
      propertyStatus,
      timeLivingInProperty,
      candidate_id: candidate.id,
      ...(contractType && {contractType}),
      ...(grantorName && {grantorName})
    }

    // Armazena informações acerca da moradia no banco de dados
    await prisma.housing.create({
      data: dataToCreate
      
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
