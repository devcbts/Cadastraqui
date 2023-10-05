import { FastifyInstance } from 'fastify'
import { registerLegalResponsible } from './register'
import { createLegalDependent } from './create-legal-dependent'

export async function legalResponsibleRoutes(app: FastifyInstance) {
  app.post('/', registerLegalResponsible)
  app.post('/legal-dependents', createLegalDependent)
}
