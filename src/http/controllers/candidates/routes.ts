import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'
import { getCandidateInfo } from './get-info'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerIdentityInfo } from './registerIdentityInfo'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/', registerCandidate)

  /** Authenticated Routes */
  app.get('/info', { onRequest: [verifyJWT] }, getCandidateInfo)
  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
}
