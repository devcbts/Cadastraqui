import { FastifyInstance } from 'fastify'
import { registerLegalResponsible } from './register'
import { createLegalDependent } from './create-legal-dependent'
import { fetchLegalDependents } from './fetch-legal-dependents'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { deleteLegalDependents } from './delete-legal-dependent'

export async function legalResponsibleRoutes(app: FastifyInstance) {
  app.post('/', registerLegalResponsible)
  app.post('/legal-dependents', createLegalDependent)

  /** Authenticated Routes */
  app.get(
    '/legal-dependents/:dependent_id?',
    { onRequest: [verifyJWT] },
    fetchLegalDependents,
  )
  app.delete(
    '/legal-dependents/:dependent_id?',
    { onRequest: [verifyJWT] },
    deleteLegalDependents,
  )
}
