import { hash } from 'bcryptjs'
import { LegalReponsibleRepository } from '@/repositories/reponsible-repository'
import { LegalDependent } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { LegalDependentRepository } from '@/repositories/dependent-repository'

export enum COUNTRY {
  AC = 'AC',
  AL = 'AL',
  AM = 'AM',
  AP = 'AP',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MG = 'MG',
  MS = 'MS',
  MT = 'MT',
  PA = 'PA',
  PB = 'PB',
  PE = 'PE',
  PI = 'PI',
  PR = 'PR',
  RJ = 'RJ',
  RN = 'RN',
  RO = 'RO',
  RR = 'RR',
  RS = 'RS',
  SC = 'SC',
  SE = 'SE',
  SP = 'SP',
  TO = 'TO',
}

interface RegisterUseCaseRequest {
  name_responsible: string
  name_dependent: string
  email: string
  password: string
  address: string
  city: string
  UF: COUNTRY
  CEP: string
  CPF_responsible: string
  CPF_dependent: string
  neighborhood: string
  number_of_address: number
  phone: string
  date_of_birth_responsible: Date
  date_of_birth_dependent: Date
}

interface RegisterUseCaseResponse {
  legalDependent: LegalDependent
}

export class RegisterLegalDependentUseCase {
  constructor(
    private legalReponsibleRepository: LegalReponsibleRepository,
    private usersRepository: UsersRepository,
    private legalDependentRepository: LegalDependentRepository,
  ) {
    this.legalReponsibleRepository = legalReponsibleRepository
    this.usersRepository = usersRepository
    this.legalDependentRepository = legalDependentRepository
  }

  async execute({
    email,
    password,
    CEP,
    CPF_responsible,
    CPF_dependent,
    UF,
    address,
    city,
    neighborhood,
    number_of_address,
    phone,
    date_of_birth_dependent,
    date_of_birth_responsible,
    name_dependent,
    name_responsible,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    // Cria usuário
    const user = await this.usersRepository.create({
      email,
      password: password_hash,
      role: 'RESPONSIBLE',
    })
    // Cria Responsável Legal
    const legalResponsible = await this.legalReponsibleRepository.create({
      address,
      CEP,
      city,
      CPF: CPF_responsible,
      date_of_birth: date_of_birth_responsible,
      name: name_responsible,
      neighborhood,
      number_of_address,
      phone,
      UF,
      user_id: user.id,
    })

    // Cria Dependente Legal
    const legalDependent = await this.legalDependentRepository.create({
      CPF: CPF_dependent,
      date_of_birth: date_of_birth_dependent,
      name: name_dependent,
      responsible_id: legalResponsible.id,
    })

    return { legalDependent }
  }
}
