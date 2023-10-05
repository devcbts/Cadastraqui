import { UsersRepository } from '@/repositories/users-repository'
import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: data.id ?? randomUUID(),
      email: data.email,
      password: data.password,
      role: data.role ?? 'CANDIDATE',
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id)
    if (!user) {
      return null
    }
    return user
  }
}
