import { LegalResponsible, Prisma } from '@prisma/client'

export interface LegalReponsibleRepository {
  create(
    data: Prisma.LegalResponsibleUncheckedCreateInput,
  ): Promise<LegalResponsible>
}
