import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { prisma } from '@/lib/prisma'

export async function createLegalDependent(
  name: string, CPF: string, birthDate: string, responsible_id: string
) {
 
  try {
    const responsible = await prisma.legalResponsible.findUnique({
      where: { id: responsible_id },
    })
    const candidateWithSameCPF = await prisma.candidate.findUnique({
      where: { CPF },
    })

    if (!responsible) {
      throw new NotAllowedError()
    }

    if (candidateWithSameCPF) {
      throw new UserAlreadyExistsError()
    }

    await prisma.candidate.create({
      data: {
        address: responsible.address,
        CEP: responsible.CEP,
        city: responsible.city,
        CPF,
        birthDate: new Date(birthDate),
        name,
        neighborhood: responsible.neighborhood,
        addressNumber: responsible.addressNumber,
        phone: responsible.phone,
        UF: responsible.UF,
        responsible_id: responsible.id,
      },
    })

  } catch (err: any) {
    return err
  }
}
