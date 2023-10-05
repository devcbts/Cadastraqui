import { Candidate } from '@prisma/client'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { UsersRepository } from '@/repositories/users-repository'
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
  candidate: Candidate
}

export class RegisterCandidateUseCase {
  constructor(
    private candidatesRepository: CandidatesRepository,
    private usersRepository: UsersRepository,
  ) {
    this.candidatesRepository = candidatesRepository
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
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new UserNotExistsError()
    }

    const candidate = await this.candidatesRepository.create({
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

    return { candidate }
  }
}
