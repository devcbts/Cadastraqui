import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyRole } from '@/http/middlewares/verify-role'
import { FastifyInstance } from 'fastify'
import { deleteLegalDependents } from './delete-legal-dependent'
import { fetchLegalDependents } from './fetch-legal-dependents'
import { getResponsibleInfo } from './get-resposible-info'
import { registerLegalResponsible } from './register'
import updateResponsible from './update-responsible'

export async function legalResponsibleRoutes(app: FastifyInstance) {
  app.post('/', registerLegalResponsible)
  app.get('/', { onRequest: [verifyJWT] }, getResponsibleInfo)
  app.patch('/update-profile', { onRequest: [verifyJWT, verifyRole("RESPONSIBLE")] }, updateResponsible)

  /** Legal Responsible Routes */

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

  // app.patch(
  //   '/legal-dependents/:_id',
  //   { onRequest: [verifyJWT] },
  //   updateLegalDependent,
  // )
}
