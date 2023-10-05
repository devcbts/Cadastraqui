import { COUNTRY } from '../../use-cases/candidates/register'
import { InMemoryLegalResponsibleRepository } from '../../../in-memory/in-memory-reponsibles-repository'
import { RegisterLegalResponsibleUseCase } from '../../use-cases/legal-reponsible/register'
import { UsersRepository } from '../../repositories/users-repository'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { UserNotExistsError } from '../../use-cases/errors/user-not-exists-error'

let usersRepository: UsersRepository
let legalResponsibleRepository: InMemoryLegalResponsibleRepository
let sut: RegisterLegalResponsibleUseCase // sut => System Under Testing

describe('Register Legal Responsible Use Case', () => {
  beforeEach(() => {
    legalResponsibleRepository = new InMemoryLegalResponsibleRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterLegalResponsibleUseCase(
      legalResponsibleRepository,
      usersRepository,
    )
  })

  test('should be able to register a legal dependent ', async () => {
    const user = await usersRepository.create({
      email: 'user@example.com',
      password: '123455',
      role: 'RESPONSIBLE',
    })

    const { legalResponsible } = await sut.execute({
      address: 'address test',
      CEP: '123',
      city: 'city test',
      CPF: '123',
      date_of_birth: new Date('2023-05-03'),
      name: 'teste name',
      neighborhood: 'test',
      number_of_address: 21,
      phone: '9988',
      UF: COUNTRY.CE,
      user_id: user.id,
    })

    expect(legalResponsible.id).toEqual(expect.any(String))
  })

  test('should not be able to register without valid user_id', async () => {
    await expect(() =>
      sut.execute({
        address: 'address test',
        CEP: '123',
        city: 'city test',
        CPF: '123',
        date_of_birth: new Date('2023-05-03'),
        name: 'teste name',
        neighborhood: 'test',
        number_of_address: 21,
        phone: '9988',
        UF: COUNTRY.CE,
        user_id: 'fake-user',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
