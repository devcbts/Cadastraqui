export class FamilyMemberAlreadyExistsError extends Error {
  constructor() {
    super('Cadastrante ou Membro da Família já cadastrado com esse RG ou CPF.')
  }
}
