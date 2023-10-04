import { AssistantRepository } from '@/repositories/assistant-repository'
import { Assistant, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryAssistantRepository implements AssistantRepository {
  public items: Assistant[] = []

  async create(data: Prisma.AssistantUncheckedCreateInput) {
    const assistant: Assistant = {
      id: data.id ?? randomUUID(),
      name: data.name,
      user_id: data.user_id,
      entity_id: data.entity_id,
    }

    this.items.push(assistant)
    return assistant
  }
}
