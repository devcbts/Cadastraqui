import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { InMemoryAssistantRepository } from '../../../in-memory/in-memory-assistant-repository'
import { InMemoryEntityRepository } from '../../../in-memory/in-memory-entity-repository'
import { RegisterAssistantUseCase } from '../../use-cases/assistant/register'
import { UserNotExistsError } from '../../use-cases/errors/user-not-exists-error'
import { EntityNotExistsError } from '../../use-cases/errors/entity-not-exists-error'

let usersRepository: InMemoryUsersRepository
let assistantRepository: InMemoryAssistantRepository
let entityRepository: InMemoryEntityRepository
let sut: RegisterAssistantUseCase // sut => System Under Testing

describe('Register Assistant Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    assistantRepository = new InMemoryAssistantRepository()
    entityRepository = new InMemoryEntityRepository()
    sut = new RegisterAssistantUseCase(
      assistantRepository,
      usersRepository,
      entityRepository,
    )
  })

  test('should be able to register an assistant', async () => {
    const user_assistant = await usersRepository.create({
      email: 'user@example.com',
      password: '123456',
      role: 'ASSISTANT',
    })
    const user_entity = await usersRepository.create({
      email: 'user@example.com',
      password: '123456',
      role: 'ENTITY',
    })

    const entity = await entityRepository.create({
      address: 'address test',
      name: 'teste name entity',
      phone: '123',
      user_id: user_entity.id,
    })

    const { assistant } = await sut.execute({
      name: 'teste-assistant-name',
      entity_id: entity.id,
      user_id: user_assistant.id,
    })

    expect(assistant.id).toEqual(expect.any(String))
  })

  test('should not be able to register assistant without user_id', async () => {
    const user_entity = await usersRepository.create({
      email: 'user@example.com',
      password: '123456',
      role: 'ENTITY',
    })

    const entity = await entityRepository.create({
      address: 'address test',
      name: 'teste name entity',
      phone: '123',
      user_id: user_entity.id,
    })

    await expect(() =>
      sut.execute({
        name: 'teste-assistant-name',
        entity_id: entity.id,
        user_id: 'fake-user-assistant',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })

  test('should not be able to register assistant without entity_id', async () => {
    const user_assistant = await usersRepository.create({
      email: 'user@example.com',
      password: '123456',
      role: 'ENTITY',
    })

    await expect(() =>
      sut.execute({
        name: 'teste-assistant-name',
        entity_id: 'fake-entity',
        user_id: user_assistant.id,
      }),
    ).rejects.toBeInstanceOf(EntityNotExistsError)
  })
})
