import { ForbiddenError } from '@/errors/forbidden-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateHousingInfo(
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
    grantorName: z.string().optional().nullable(),
    propertyStatus: PropertyStatus,
    contractType: ContractType.optional().nullable(),
    timeLivingInProperty: TimeLivingInProperty,
    domicileType: DomicileType,
    numberOfRooms: NumberOfRooms,
    numberOfBedrooms: z.number(),
  }).partial()

  const updateData = housingDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    const candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ForbiddenError()

    }
    const idField = candidateOrResponsible.IsResponsible ? { responsible_id: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    const candidateHousingInfo = await prisma.housing.findUnique({
      where: { ...idField },
    })
    // Analisa se o candidato não possui cadastro de moradia
    if (!candidateHousingInfo) {
      throw new ResourceNotFoundError()
    }
    const dataToUpdate: Record<string, any> = {}
    for (const key in updateData) {
      if (typeof updateData[key as keyof typeof updateData] !== 'undefined') {
        dataToUpdate[key as keyof typeof updateData] =
          updateData[key as keyof typeof updateData]
      }
    }

    // Armazena informações acerca da moradia no banco de dados
    await prisma.housing.update({
      data: dataToUpdate,
      where: { ...idField },
    })
    const idFieldRegistration = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    await prisma.finishedRegistration.upsert({
      where: idFieldRegistration,

      create: { moradia: true, ...idFieldRegistration },
      update: { moradia: true },
    })
    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
