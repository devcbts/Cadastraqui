export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um cadastro com esse Email ou CPF.')
  }
}
