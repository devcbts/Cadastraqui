export class SubsidiaryDirectorAlreadyExistsError extends Error {
  constructor() {
    super('Diretor da subsidiária já cadastrado.')
  }
}
