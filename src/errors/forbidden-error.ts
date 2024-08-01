export class ForbiddenError extends Error {
  constructor() {
    super('Proibido. Você não tem a permissão necessária para acessar essas informações.')
  }
}