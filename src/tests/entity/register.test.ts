import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { InMemoryEntityRepository } from '../../../in-memory/in-memory-entity-repository'
import { RegisterEntityUseCase } from '../../use-cases/entity/register'
import { UserNotExistsError } from '../../use-cases/errors/user-not-exists-error'

let usersRepository: InMemoryUsersRepository
let entitysRepository: InMemoryEntityRepository
let sut: RegisterEntityUseCase // sut => System Under Testing

describe('Register Entity Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    entitysRepository = new InMemoryEntityRepository()
    sut = new RegisterEntityUseCase(entitysRepository, usersRepository)
  })

  test('should be able to register an entity', async () => {
    const user = await usersRepository.create({
      email: 'user@example.com',
      password: '123456',
      role: 'ENTITY',
    })

    const { entity } = await sut.execute({
      address: 'address test',
      name: 'teste name entity',
      phone: '123',
      user_id: user.id,
    })

    expect(entity.id).toEqual(expect.any(String))
  })

  test('should not be able to register an entity without valid user_id', async () => {
    await expect(() =>
      sut.execute({
        address: 'address test',
        name: 'teste name entity',
        phone: '123',
        user_id: 'fake-user',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
