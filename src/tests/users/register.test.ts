import { UsersRepository } from '../../repositories/users-repository'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { RegisterUserUseCase } from '../../use-cases/users/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'

let usersRepository: UsersRepository
let sut: RegisterUserUseCase // sut => System Under Testing

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  test('should be able to register an user', async () => {
    const user = await usersRepository.create({
      email: 'user@example.com',
      password: '123455',
      role: 'CANDIDATE',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should not be able to register user with same email', async () => {
    const email = 'user@example.com'

    await usersRepository.create({
      email,
      password: '123455',
      role: 'CANDIDATE',
    })

    await expect(() =>
      sut.execute({
        email,
        password: '123455',
        role: 'CANDIDATE',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
