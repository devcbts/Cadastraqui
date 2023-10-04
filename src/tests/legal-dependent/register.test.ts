import { COUNTRY } from '../../use-cases/candidates/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'
import { InMemoryLegalDependentRepository } from '../../../in-memory/in-memory-dependents-repository'
import { RegisterLegalDependentUseCase } from '../../use-cases/legal-dependent/register'
import { InMemoryLegalResponsibleRepository } from '../../../in-memory/in-memory-reponsibles-repository'

let usersRepository: InMemoryUsersRepository
let legalDependentRepository: InMemoryLegalDependentRepository
let legalResponsibleRepository: InMemoryLegalResponsibleRepository
let sut: RegisterLegalDependentUseCase // sut => System Under Testing

describe('Register Legal Dependent Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    legalDependentRepository = new InMemoryLegalDependentRepository()
    legalResponsibleRepository = new InMemoryLegalResponsibleRepository()
    sut = new RegisterLegalDependentUseCase(
      legalResponsibleRepository,
      usersRepository,
      legalDependentRepository,
    )
  })

  test('should be able to register a legal dependent ', async () => {
    const { legalDependent } = await sut.execute({
      address: 'address test',
      CEP: '123',
      city: 'city test',
      CPF_responsible: '123-responsible',
      CPF_dependent: '123-dependent',
      date_of_birth_dependent: new Date('2023-05-03'),
      date_of_birth_responsible: new Date('2023-05-03'),
      name_dependent: 'teste dependent name',
      name_responsible: 'teste responsible name',
      neighborhood: 'test',
      number_of_address: 21,
      phone: '9988',
      UF: COUNTRY.CE,
      email: 'teste@example.com',
      password: 'teste-password',
    })

    expect(legalDependent.id).toEqual(expect.any(String))
  })

  test('should not be able to register with same email', async () => {
    const email = 'teste@example.com'

    await sut.execute({
      address: 'address test',
      CEP: '123',
      city: 'city test',
      CPF_responsible: '123-responsible',
      CPF_dependent: '123-dependent',
      date_of_birth_dependent: new Date('2023-05-03'),
      date_of_birth_responsible: new Date('2023-05-03'),
      name_dependent: 'teste dependent name',
      name_responsible: 'teste responsible name',
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
        CPF_responsible: '123-responsible',
        CPF_dependent: '123-dependent',
        date_of_birth_dependent: new Date('2023-05-03'),
        date_of_birth_responsible: new Date('2023-05-03'),
        name_dependent: 'teste dependent name',
        name_responsible: 'teste responsible name',
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
