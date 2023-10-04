import { hash } from 'bcryptjs'
import { Assistant } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { AssistantRepository } from '@/repositories/assistant-repository'
import { EntityRepository } from '@/repositories/entity-repository'

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
  email: string
  password: string
  name: string
  phone: string
  address: string
}

interface RegisterUseCaseResponse {
  assistant: Assistant
}

export class RegisterAssistantUseCase {
  constructor(
    private assistantRepository: AssistantRepository,
    private usersRepository: UsersRepository,
    private entityRepository: EntityRepository,
  ) {
    this.assistantRepository = assistantRepository
    this.usersRepository = usersRepository
    this.entityRepository = entityRepository
  }

  async execute({
    email,
    password,
    name,
    address,
    phone,
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
      role: 'ASSISTANT',
    })
    // Cria Entidade
    const entity = await this.entityRepository.create({
      address,
      name,
      phone,
      user_id: user.id,
    })

    // Cria Assistente Social
    const assistant = await this.assistantRepository.create({
      name,
      entity_id: entity.id,
      user_id: user.id,
    })

    return { assistant }
  }
}
