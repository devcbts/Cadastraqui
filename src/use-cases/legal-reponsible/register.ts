import { LegalReponsibleRepository } from '@/repositories/reponsible-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { LegalResponsible } from '@prisma/client'
import { UserNotExistsError } from '../errors/user-not-exists-error'

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
  address: string
  city: string
  UF: COUNTRY
  CEP: string
  CPF: string
  neighborhood: string
  number_of_address: number
  phone: string
  date_of_birth: Date
  user_id: string
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
    user_id,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Verifica se existe um usuário com user_id
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new UserNotExistsError()
    }

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
      user_id,
    })

    return { legalResponsible }
  }
}
