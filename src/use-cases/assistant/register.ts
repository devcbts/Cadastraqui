import { hash } from 'bcryptjs'
import { Assistant } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { AssistantRepository } from '@/repositories/assistant-repository'
import { EntityRepository } from '@/repositories/entity-repository'
import { UserNotExistsError } from '../errors/user-not-exists-error'
import { EntityNotExistsError } from '../errors/entity-not-exists-error'

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
  entity_id: string
  name: string
  user_id: string
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
    name,
    entity_id,
    user_id,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new UserNotExistsError()
    }

    const entity = await this.entityRepository.findById(entity_id)

    if (!entity) {
      throw new EntityNotExistsError()
    }

    const assistant = await this.assistantRepository.create({
      name,
      entity_id,
      user_id,
    })

    return { assistant }
  }
}
