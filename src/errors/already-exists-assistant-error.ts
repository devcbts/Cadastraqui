export class AssistantAlreadyExistsError extends Error {
    constructor() {
      super('Assistant already exists with this CPF.')
    }
  }
  