export class ApplicationAlreadyExistsError extends Error {
    constructor() {
      super('Inscrição já existente para esse candidato.')
    }
  }
  