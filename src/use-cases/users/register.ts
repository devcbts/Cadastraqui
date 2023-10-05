import { UsersRepository } from '@/repositories/users-repository'
import { ROLE, User } from '@prisma/client'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  email: string
  password: string
  role: ROLE
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    email,
    password,
    role,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      email,
      password,
      role,
    })

    return { user }
  }
}
