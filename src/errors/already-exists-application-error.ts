export class ApplicationAlreadyExistsError extends Error {
    constructor() {
      super('Application already exists for this candidate.')
    }
  }
  