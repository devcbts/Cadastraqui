import { InMemoryCandidatesRepository } from '../../../in-memory/in-memory-candidates-repository'
import { GetCandidateProfileService } from '../../use-cases/candidates/get-candidate-profile'
import { CandidateNotExistsError } from '../../use-cases/errors/candidate-not-exists-error'
import { COUNTRY } from '@prisma/client'

let candidatesRepository: InMemoryCandidatesRepository
let sut: GetCandidateProfileService // sut => System Under Test

describe('Get candidate profile service', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    sut = new GetCandidateProfileService(candidatesRepository)
  })

  test('should be able to get candidate profile', async () => {
    const createdCandidate = await candidatesRepository.create({
      address: 'address test',
      CEP: '123',
      city: 'city test',
      CPF: '123',
      date_of_birth: new Date('2023-05-03'),
      name: 'test name',
      neighborhood: 'test',
      number_of_address: 21,
      phone: '9988',
      UF: COUNTRY.CE,
      user_id: 'test-user',
    })

    const { candidate } = await sut.execute({
      candidate_id: createdCandidate.id,
    })

    expect(candidate.name).toEqual('test name')
  })

  test('should not be able to get candidate profile with wrong id', async () => {
    expect(() =>
      sut.execute({ candidate_id: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(CandidateNotExistsError)
  })
})
