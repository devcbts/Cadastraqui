import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
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
    grantorName: z.string().nullish(),
    propertyStatus: PropertyStatus,
    contractType: ContractType.nullish(),
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
    const CandidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!CandidateOrResponsible) {
      throw new NotAllowedError()
    }
    const idField = CandidateOrResponsible.IsResponsible ? { legalresponsible_id: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id }
    const dataToCreate = {
      domicileType,

      numberOfBedrooms,
      numberOfRooms,
      propertyStatus,
      timeLivingInProperty,
      ...idField,
      ...(contractType && { contractType }),
      ...(grantorName && { grantorName })
    }

    // Armazena informações acerca da moradia no banco de dados
    const { id } = await prisma.housing.create({
      data: dataToCreate

    })
    await prisma.finishedRegistration.updateMany({
      where: { OR: [{ candidate_id: CandidateOrResponsible.UserData.id }, { legalResponsibleId: CandidateOrResponsible.UserData.id }]},
      data: { moradia: true }
    
    })
    return reply.status(201).send({ id })
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
