export class EntitySubsidiaryAlreadyExistsError extends Error {
  constructor() {
    super('Filial já existe com esse CNPJ.')
  }
}
