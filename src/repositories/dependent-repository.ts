import { LegalDependent, Prisma } from '@prisma/client'

export interface LegalDependentRepository {
  create(
    data: Prisma.LegalDependentUncheckedCreateInput,
  ): Promise<LegalDependent>
}
