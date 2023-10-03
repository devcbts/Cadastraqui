import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { RegisterUseCase } from '../../use-cases/users/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase // sut => System Under Testing

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  test('should be able to register an user ', async () => {
    const { user } = await sut.execute({
      email: 'teste@example.com',
      password: 'teste-password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should hash password in registration', async () => {
    const { user } = await sut.execute({
      email: 'teste@example.com',
      password: 'teste-password',
    })

    const doesUserPasswordHashed = await compare(
      'teste-password',
      user.password_hash,
    )

    expect(doesUserPasswordHashed).toBe(true)
  })

  test('should not be able to register with same email', async () => {
    const email = 'teste@example.com'

    await sut.execute({
      email,
      password: 'teste-password',
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'teste-password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
