import { EntityRepository } from '@/repositories/entity-repository'
import { Entity, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryEntityRepository implements EntityRepository {
  public items: Entity[] = []

  async create(data: Prisma.EntityUncheckedCreateInput) {
    const entity = {
      id: data.id ?? randomUUID(),
      address: data.address,
      name: data.name,
      phone: data.phone,
      user_id: data.user_id,
    }

    this.items.push(entity)
    return entity
  }
}
