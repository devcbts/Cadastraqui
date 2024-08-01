export class EntityMatrixAlreadyExistsError extends Error {
  constructor() {
    super('Já existe uma matriz associada a essa entidade.')
  }
}
