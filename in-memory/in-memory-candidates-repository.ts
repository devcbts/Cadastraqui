import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Prisma, Candidate } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryCandidatesRepository implements CandidatesRepository {
  public items: Candidate[] = []

  async create(data: Prisma.CandidateUncheckedCreateInput) {
    const candidate: Candidate = {
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
      user_id: data.user_id ?? '',
      responsible_id: data.responsible_id ?? '',
    }

    this.items.push(candidate)
    return candidate
  }

  async countDependentsByResponsibleId(id: string) {
    const numberOfDependents = this.items
      .filter((candidate) => !!candidate.responsible_id)
      .filter((candidate) => candidate.responsible_id === id).length

    return numberOfDependents
  }

  async findById(id: string) {
    const candidate = this.items.find((candidate) => candidate.id === id)
    if (!candidate) {
      return null
    }
    return candidate
  }
}
