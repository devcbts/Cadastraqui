export class EntitySubsidiaryAlreadyExistsError extends Error {
  constructor() {
    super('Entity Subsidiary already exists with this CNPJ.')
  }
}
