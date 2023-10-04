export class LegalResponsibleAlreadyExistsError extends Error {
  constructor() {
    super('Legal Responsible already exists with this email.')
  }
}
