import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Prisma, Candidate } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryCandidatesRepository implements CandidatesRepository {
  public items: Candidate[] = []

  async findByEmail(email: string) {
    const candidate = this.items.find((item) => item.email === email)

    if (!candidate) {
      return null
    }

    return candidate
  }

  async findById(id: string) {
    const candidate = this.items.find((item) => item.id === id)

    if (!candidate) {
      return null
    }

    return candidate
  }

  async create(data: Prisma.CandidateCreateInput) {
    const candidate = {
      id: data.id ?? randomUUID(),
      created_at: new Date(),
      address: data.address,
      CEP: data.CEP,
      city: data.city,
      CPF: data.CPF,
      email: data.email,
      date_of_birth: new Date(data.date_of_birth),
      name: data.name,
      neighborhood: data.neighborhood,
      number_of_address: data.number_of_address,
      phone: data.phone,
      UF: data.UF,
      password: data.password,
      role: data.role ?? 'USER',
    }

    this.items.push(candidate)
    return candidate
  }
}
