export class DirectorAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um responsável com esse CPF.')
  }
}
