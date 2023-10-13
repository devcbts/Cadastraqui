export class SubsidiaryNotExistsError extends Error {
  constructor() {
    super('Subsidiary not exists.')
  }
}
