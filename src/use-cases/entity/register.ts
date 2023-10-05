import { Entity } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { EntityRepository } from '@/repositories/entity-repository'
import { UserNotExistsError } from '../errors/user-not-exists-error'

interface RegisterUseCaseRequest {
  name: string
  phone: string
  address: string
  user_id: string
}

interface RegisterUseCaseResponse {
  entity: Entity
}

export class RegisterEntityUseCase {
  constructor(
    private entitysRepository: EntityRepository,
    private usersRepository: UsersRepository,
  ) {
    this.entitysRepository = entitysRepository
    this.usersRepository = usersRepository
  }

  async execute({
    address,
    name,
    phone,
    user_id,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new UserNotExistsError()
    }

    const entity = await this.entitysRepository.create({
      address,
      name,
      phone,
      user_id,
    })

    return { entity }
  }
}
