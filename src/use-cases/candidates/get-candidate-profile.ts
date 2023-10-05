import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Candidate } from '@prisma/client'
import { CandidateNotExistsError } from '../errors/candidate-not-exists-error'

interface GetCandidateProfileServiceRequest {
  candidate_id: string
}

interface GetCandidateProfileServiceResponse {
  candidate: Candidate
}

export class GetCandidateProfileService {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    candidate_id,
  }: GetCandidateProfileServiceRequest): Promise<GetCandidateProfileServiceResponse> {
    const candidate = await this.candidatesRepository.findById(candidate_id)

    if (!candidate) {
      throw new CandidateNotExistsError()
    }
    console.log(candidate)

    return { candidate }
  }
}
