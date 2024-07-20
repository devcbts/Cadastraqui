import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateLegalDependent(
  name: string, CPF: string,oldCPF: string, birthDate: string, responsible_id: string
) {
  
  try {
    const dependent = await prisma.candidate.findUnique({
      where: { CPF: oldCPF, responsible_id},
    })

    if (!dependent) {
      throw new ResourceNotFoundError()
    }

    await prisma.candidate.update({
      where: { id: dependent.id },
      data: {
        name,
        CPF,
        birthDate,
      },
    })

  } catch (err: any) {
    return err
  }
}
