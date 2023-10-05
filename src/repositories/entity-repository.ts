import { Entity, Prisma } from '@prisma/client'

export interface EntityRepository {
  create(data: Prisma.EntityUncheckedCreateInput): Promise<Entity>
  findById(id: string): Promise<Entity | null>
}
