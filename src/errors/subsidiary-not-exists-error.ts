export class SubsidiaryNotExistsError extends Error {
  constructor() {
    super('Subsidiária não existe.')
  }
}
