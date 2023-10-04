import { Prisma, Assistant } from '@prisma/client'

export interface AssistantRepository {
  create(data: Prisma.AssistantUncheckedCreateInput): Promise<Assistant>
}
