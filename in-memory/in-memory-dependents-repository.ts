import { LegalDependentRepository } from '@/repositories/dependent-repository'
import { Prisma, LegalDependent } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryLegalDependentRepository
  implements LegalDependentRepository
{
  public items: LegalDependent[] = []

  async create(data: Prisma.LegalDependentUncheckedCreateInput) {
    const responsible = {
      id: data.id ?? randomUUID(),
      created_at: new Date(),
      CPF: data.CPF,
      date_of_birth: new Date(data.date_of_birth),
      name: data.name,
      responsible_id: data.responsible_id,
    }

    this.items.push(responsible)
    return responsible
  }
}
