export class EntityMatrixAlreadyExistsError extends Error {
  constructor() {
    super('Entity Matrix already exists to this Entity.')
  }
}
