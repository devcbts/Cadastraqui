export class DirectorAlreadyExistsError extends Error {
  constructor() {
    super('Director already exists with this CPF.')
  }
}
