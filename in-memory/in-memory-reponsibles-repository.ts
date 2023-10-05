import { LegalReponsibleRepository } from '@/repositories/reponsible-repository'
import { Prisma, LegalResponsible } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryLegalResponsibleRepository
  implements LegalReponsibleRepository
{
  public items: LegalResponsible[] = []

  async create(data: Prisma.LegalResponsibleUncheckedCreateInput) {
    const responsible = {
      id: data.id ?? randomUUID(),
      created_at: new Date(),
      address: data.address,
      CEP: data.CEP,
      city: data.city,
      CPF: data.CPF,
      date_of_birth: new Date(data.date_of_birth),
      name: data.name,
      neighborhood: data.neighborhood,
      number_of_address: data.number_of_address,
      phone: data.phone,
      UF: data.UF,
      role: data.role ?? 'CANDIDATE',
      user_id: data.user_id,
    }

    this.items.push(responsible)
    return responsible
  }

  async findById(id: string) {
    const responsible = this.items.find((responsible) => responsible.id === id)

    if (!responsible) {
      return null
    }

    return responsible
  }
}
