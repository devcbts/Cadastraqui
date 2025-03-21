import {
  COUNTRY,
  RegisterCandidateUseCase,
} from '../../use-cases/candidates/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { InMemoryCandidatesRepository } from '../../../in-memory/in-memory-candidates-repository'
import { InMemoryUsersRepository } from '../../../in-memory/in-memory-users-repository'

let candidatesRepository: InMemoryCandidatesRepository
let usersRepository: InMemoryUsersRepository
let sut: RegisterCandidateUseCase // sut => System Under Testing

describe('Register Candidate Use Case', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterCandidateUseCase(candidatesRepository, usersRepository)
  })

  test('should be able to register an candidate ', async () => {
    const { candidate } = await sut.execute({
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

    expect(candidate.id).toEqual(expect.any(String))
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
