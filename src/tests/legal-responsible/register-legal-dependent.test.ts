import { RegisterLegalDependentUseCase } from '../../use-cases/legal-reponsible/register-legal-dependent'
import { InMemoryLegalResponsibleRepository } from '../../../in-memory/in-memory-reponsibles-repository'
import { InMemoryCandidatesRepository } from '../../../in-memory/in-memory-candidates-repository'
import { COUNTRY } from '@prisma/client'
import { LegalResponsibleNotExistsError } from '../../use-cases/errors/legal-responsible-not-exists-error'
import { TooManyDependentsError } from '../../use-cases/errors/too-many-legal-dependents-error'

let candidatesRepository: InMemoryCandidatesRepository
let legalResponsibleRepository: InMemoryLegalResponsibleRepository
let sut: RegisterLegalDependentUseCase // sut => System Under Testing

describe('Register Legal Dependent Use Case', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    legalResponsibleRepository = new InMemoryLegalResponsibleRepository()
    sut = new RegisterLegalDependentUseCase(
      candidatesRepository,
      legalResponsibleRepository,
    )
  })

  test('should be able to register a dependent', async () => {
    const user_id = 'teste-user'

    // Cria primeiro o responsável legal
    const legalResponsible = await legalResponsibleRepository.create({
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
      user_id,
    })

    const { legalDependent } = await sut.execute({
      CPF: 'dependent CPF',
      date_of_birth: new Date('2023-05-03'),
      name: 'dependent name',
      responsible_id: legalResponsible.id,
    })

    expect(legalDependent.id).toEqual(expect.any(String))
  })

  test('should not be able to register a dependent without valid responsble_id', async () => {
    const responsible_id = 'without-legal-responsible'

    await expect(() =>
      sut.execute({
        CPF: 'dependent CPF',
        date_of_birth: new Date('2023-05-03'),
        name: 'dependent name',
        responsible_id,
      }),
    ).rejects.toBeInstanceOf(LegalResponsibleNotExistsError)
  })

  test('should not be able to register a dependent if responsible already has 6 dependents', async () => {
    const user_id = 'teste-user'

    // Cria primeiro o responsável legal
    const legalResponsible = await legalResponsibleRepository.create({
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
      user_id,
    })

    for (let i = 0; i < 6; i++) {
      await sut.execute({
        CPF: 'dependent CPF',
        date_of_birth: new Date('2023-05-03'),
        name: 'dependent name',
        responsible_id: legalResponsible.id,
      })
    }

    await expect(() =>
      sut.execute({
        CPF: 'dependent CPF',
        date_of_birth: new Date('2023-05-03'),
        name: 'dependent name',
        responsible_id: legalResponsible.id,
      }),
    ).rejects.toBeInstanceOf(TooManyDependentsError)
  })
})
