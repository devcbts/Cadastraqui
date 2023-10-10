import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'
import { getCandidateInfo } from './get-info'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerIdentityInfo } from './registerIdentityInfo'
import { registerHousingInfo } from './registerHousingInfo'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/', registerCandidate)

  /** Authenticated Routes */
  app.get('/info', { onRequest: [verifyJWT] }, getCandidateInfo)
  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
  app.post('/housing-info', { onRequest: [verifyJWT] }, registerHousingInfo)
}
