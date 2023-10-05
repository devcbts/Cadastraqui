export class EntityNotExistsError extends Error {
  constructor() {
    super('Entity not exists.')
  }
}
