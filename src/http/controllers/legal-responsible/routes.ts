import { FastifyInstance } from 'fastify'
import { registerLegalResponsible } from './register'
import { createLegalDependent } from './create-legal-dependent'
import { fetchLegalDependents } from './fetch-legal-dependents'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { deleteLegalDependents } from './delete-legal-dependent'
import { updateLegalDependent } from './update-legal-dependent'

export async function legalResponsibleRoutes(app: FastifyInstance) {
  app.post('/', registerLegalResponsible)

  /** Legal Responsible Routes */
  app.post('/legal-dependents', createLegalDependent)

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

  app.patch(
    '/legal-dependents/:_id',
    { onRequest: [verifyJWT] },
    updateLegalDependent,
  )
}
