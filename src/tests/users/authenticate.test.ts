import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { AuthenticateService } from '../../use-cases/users/authenticate'
import { InvalidCredentialError } from '../../use-cases/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService // sut => System Under Test

describe('Authenticate service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  test('should be able to authenticate', async () => {
    await usersRepository.create({
      email: 'john@doe.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'john@doe.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'john@doe.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  test('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      email: 'john@doe.com',
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'john@doe.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
