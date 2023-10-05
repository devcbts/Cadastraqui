import { LegalReponsibleRepository } from '@/repositories/reponsible-repository'
import { Candidate } from '@prisma/client'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { LegalResponsibleNotExistsError } from '../errors/legal-responsible-not-exists-error'
import { TooManyDependentsError } from '../errors/too-many-legal-dependents-error'

interface RegisterUseCaseRequest {
  name: string
  CPF: string
  date_of_birth: Date
  responsible_id: string
}

interface RegisterUseCaseResponse {
  legalDependent: Candidate
}

export class RegisterLegalDependentUseCase {
  constructor(
    private candidatesRepository: CandidatesRepository,
    private legalReponsibleRepository: LegalReponsibleRepository,
  ) {
    this.legalReponsibleRepository = legalReponsibleRepository
    this.candidatesRepository = candidatesRepository
  }

  async execute({
    date_of_birth,
    name,
    CPF,
    responsible_id,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const responsible =
      await this.legalReponsibleRepository.findById(responsible_id)

    if (!responsible) {
      throw new LegalResponsibleNotExistsError()
    }

    // Vê quantos dependentes o responsável já possui
    const numberOfDependents =
      await this.candidatesRepository.countDependentsByResponsibleId(
        responsible_id,
      )

    if (numberOfDependents >= 6) {
      throw new TooManyDependentsError()
    }

    // Cria Dependente Legal
    const legalDependent = await this.candidatesRepository.create({
      CPF,
      date_of_birth,
      name,
      responsible_id,
      address: responsible.address,
      CEP: responsible.CEP,
      city: responsible.city,
      neighborhood: responsible.neighborhood,
      number_of_address: responsible.number_of_address,
      phone: responsible.phone,
      UF: responsible.UF,
      role: responsible.role,
    })

    return { legalDependent }
  }
}
