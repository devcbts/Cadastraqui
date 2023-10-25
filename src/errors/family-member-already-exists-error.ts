export class FamilyMemberAlreadyExistsError extends Error {
  constructor() {
    super('Family Member already exists with this CPF or RG.')
  }
}
