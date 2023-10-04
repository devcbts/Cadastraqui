import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { InMemoryEntityRepository } from '../../../in-memory/in-memory-entity-repository'
import { RegisterEntityUseCase } from '../../use-cases/entity/register'

let usersRepository: InMemoryUsersRepository
let entitysRepository: InMemoryEntityRepository
let sut: RegisterEntityUseCase // sut => System Under Testing

describe('Register Entity  Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    entitysRepository = new InMemoryEntityRepository()
    sut = new RegisterEntityUseCase(entitysRepository, usersRepository)
  })

  test('should be able to register a legal dependent ', async () => {
    const { entity } = await sut.execute({
      address: 'address test',
      name: 'teste name entity',
      email: 'teste@example.com',
      password: 'teste-password',
      phone: '123',
    })

    expect(entity.id).toEqual(expect.any(String))
  })

  test('should not be able to register with same email', async () => {
    const email = 'teste@example.com'

    await sut.execute({
      address: 'address test',
      name: 'teste name entity',
      email,
      password: 'teste-password',
      phone: '123',
    })

    await expect(() =>
      sut.execute({
        address: 'address test',
        name: 'teste name entity',
        email,
        password: 'teste-password',
        phone: '123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
