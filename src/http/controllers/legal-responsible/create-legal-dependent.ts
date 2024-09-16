import { NotAllowedError } from '@/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/errors/users-already-exists-error'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

export async function createLegalDependent(
  name: string, CPF: string, birthDate: string, responsible_id: string, db: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
) {

  try {
    const responsible = await db.legalResponsible.findUnique({
      where: { id: responsible_id },
    })
    const candidateWithSameCPF = await db.candidate.findUnique({
      where: { CPF },
    })

    if (!responsible) {
      throw new NotAllowedError()
    }

    if (candidateWithSameCPF) {
      throw new UserAlreadyExistsError()
    }

    await db.candidate.create({
      data: {
        CPF,
        birthDate: new Date(birthDate),
        name,

        responsible_id: responsible.id,
      },
    })

  } catch (err: any) {
    throw err
  }
}
