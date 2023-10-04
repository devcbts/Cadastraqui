import { COUNTRY } from '../../use-cases/candidates/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { InMemoryLegalResponsibleRepository } from '../../../in-memory/in-memory-reponsibles-repository'
import { RegisterLegalResponsibleUseCase } from '../../use-cases/legal-reponsible/register'

let usersRepository: InMemoryUsersRepository
let legalResponsibleRepository: InMemoryLegalResponsibleRepository
let sut: RegisterLegalResponsibleUseCase // sut => System Under Testing

describe('Register Legal Responsible Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    legalResponsibleRepository = new InMemoryLegalResponsibleRepository()
    sut = new RegisterLegalResponsibleUseCase(
      legalResponsibleRepository,
      usersRepository,
    )
  })

  test('should be able to register a legal dependent ', async () => {
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
      email: 'teste@example.com',
      password: 'teste-password',
    })

    expect(legalResponsible.id).toEqual(expect.any(String))
  })

  test('should not be able to register with same email', async () => {
    const email = 'teste@example.com'

    await sut.execute({
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
      email,
      password: 'teste-password',
    })

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
        email,
        password: 'teste-password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
