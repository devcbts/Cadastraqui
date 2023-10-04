import { hash } from 'bcryptjs'
import { LegalReponsibleRepository } from '@/repositories/reponsible-repository'
import { LegalResponsible } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

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
  name: string
  email: string
  password: string
  address: string
  city: string
  UF: COUNTRY
  CEP: string
  CPF: string
  neighborhood: string
  number_of_address: number
  phone: string
  date_of_birth: Date
}

interface RegisterUseCaseResponse {
  legalResponsible: LegalResponsible
}

export class RegisterLegalResponsibleUseCase {
  constructor(
    private legalReponsibleRepository: LegalReponsibleRepository,
    private usersRepository: UsersRepository,
  ) {
    this.legalReponsibleRepository = legalReponsibleRepository
    this.usersRepository = usersRepository
  }

  async execute({
    email,
    password,
    CEP,
    CPF,
    UF,
    address,
    city,
    neighborhood,
    number_of_address,
    phone,
    date_of_birth,
    name,
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
      CPF,
      date_of_birth,
      name,
      neighborhood,
      number_of_address,
      phone,
      UF,
      user_id: user.id,
    })

    return { legalResponsible }
  }
}
