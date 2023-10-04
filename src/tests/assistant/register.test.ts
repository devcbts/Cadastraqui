import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { InMemoryAssistantRepository } from '../../../in-memory/in-memory-assistant-repository'
import { InMemoryEntityRepository } from '../../../in-memory/in-memory-entity-repository'
import { RegisterAssistantUseCase } from '../../use-cases/assistant/register'

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

  test('should be able to register an assistant ', async () => {
    const { assistant } = await sut.execute({
      address: 'address test',
      email: 'teste@example.com',
      password: 'teste-password',
      name: 'teste-name',
      phone: '998',
    })

    expect(assistant.id).toEqual(expect.any(String))
  })

  test('should not be able to register with same email', async () => {
    const email = 'teste@example.com'

    await sut.execute({
      address: 'address test',
      email,
      password: 'teste-password',
      name: 'teste-name',
      phone: '998',
    })

    await expect(() =>
      sut.execute({
        address: 'address test',
        email,
        password: 'teste-password',
        name: 'teste-name',
        phone: '998',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
