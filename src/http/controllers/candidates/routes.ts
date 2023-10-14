import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'
import { getBasicsCandidateInfo } from './get-basic-candidate-info'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerIdentityInfo } from './register-identity-info'
import { registerHousingInfo } from './register-housing-info'
import { registerFamilyMemberInfo } from './register-family-member'
import { getIdentityCandidateInfo } from './get-identity-candidate-info'
import {patchIdentityInfo} from './patch-identity-candidate-info'
export async function candidateRoutes(app: FastifyInstance) {
  app.post('/', registerCandidate)

  /** Authenticated Routes */
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicsCandidateInfo)
  app.get(
    '/identity-info',
    { onRequest: [verifyJWT] },
    getIdentityCandidateInfo,
  )

  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
  app.post('/housing-info', { onRequest: [verifyJWT] }, registerHousingInfo)
  app.post(
    '/family-member',
    { onRequest: [verifyJWT] },
    registerFamilyMemberInfo,
  )
  app.patch("/identity-info",{onError: [verifyJWT]}, patchIdentityInfo)
}
