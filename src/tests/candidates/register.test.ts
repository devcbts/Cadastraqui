import { COUNTRY, RegisterUseCase } from '../../use-cases/candidates/register'
import { CandidateAlreadyExistsError } from '../../use-cases/errors/candidates-already-exists-error'
import { compare } from 'bcryptjs'
import { InMemoryCandidatesRepository } from '../../../in-memory/in-memory-candidates-repository'

let candidatesRepository: InMemoryCandidatesRepository
let sut: RegisterUseCase // sut => System Under Testing

describe('Register Candidate Use Case', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    sut = new RegisterUseCase(candidatesRepository)
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

  test('should hash password in registration', async () => {
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

    const doesCandidatePasswordHashed = await compare(
      'teste-password',
      candidate.password,
    )

    expect(doesCandidatePasswordHashed).toBe(true)
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
    ).rejects.toBeInstanceOf(CandidateAlreadyExistsError)
  })
})
