import { hash } from 'bcryptjs'
import { Candidate } from '@prisma/client'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { CandidateAlreadyExistsError } from '../errors/candidates-already-exists-error'

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
  candidate: Candidate
}

export class RegisterUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {
    this.candidatesRepository = candidatesRepository
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
    const candidateWithSameEmail =
      await this.candidatesRepository.findByEmail(email)

    if (candidateWithSameEmail) {
      throw new CandidateAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const candidate = await this.candidatesRepository.create({
      email,
      password: password_hash,
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
    })

    return { candidate }
  }
}
