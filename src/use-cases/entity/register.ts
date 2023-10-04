import { hash } from 'bcryptjs'
import { Entity } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { EntityRepository } from '@/repositories/entity-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
  phone: string
  address: string
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
    password,
    email,
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
      role: 'ENTITY',
    })
    // Cria Entidade
    const entity = await this.entitysRepository.create({
      address,
      name,
      phone,
      user_id: user.id,
    })

    return { entity }
  }
}
