import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'
import { getCandidateInfo } from './get-info'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerIdentityInfo } from './register-identity-info'
import { registerHousingInfo } from './register-housing-info'
import { registerFamilyMemberInfo } from './register-family-member'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/', registerCandidate)

  /** Authenticated Routes */
  app.get('/info', { onRequest: [verifyJWT] }, getCandidateInfo)
  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
  app.post('/housing-info', { onRequest: [verifyJWT] }, registerHousingInfo)
  app.post(
    '/family-member',
    { onRequest: [verifyJWT] },
    registerFamilyMemberInfo,
  )
}
