import { Prisma, Candidate } from '@prisma/client'

export interface CandidatesRepository {
  create(data: Prisma.CandidateCreateInput): Promise<Candidate>
  findByEmail(email: string): Promise<Candidate | null>
}
