export class AlreadyExistsError extends Error {
  constructor() {
    super('Já existe Informação cadastrada.')
  }
}
