import { Prisma, Candidate } from '@prisma/client'

export interface CandidatesRepository {
  create(data: Prisma.CandidateUncheckedCreateInput): Promise<Candidate>
  countDependentsByResponsibleId(id: string): Promise<number>
  findById(id: string): Promise<Candidate | null>
}
