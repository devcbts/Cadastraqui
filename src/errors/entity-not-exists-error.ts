export class EntityNotExistsError extends Error {
  constructor() {
    super('Entidade não existe.')
  }
}
