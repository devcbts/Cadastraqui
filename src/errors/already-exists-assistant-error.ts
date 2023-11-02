export class AssistantAlreadyExistsError extends Error {
  constructor() {
    super('Já existe assistente social com esse CPF.')
  }
}
