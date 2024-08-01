export class LegalResponsibleNotExistsError extends Error {
  constructor() {
    super('Responsável Legal não existe.')
  }
}
