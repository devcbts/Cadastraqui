import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'
import { getBasicInfo } from './get-basic-info'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerIdentityInfo } from './register-identity-info'
import { registerHousingInfo } from './register-housing-info'
import { registerFamilyMemberInfo } from './register-family-member'
import { getIdentityInfo } from './get-identity-info'
import { updateIdentityInfo } from './update-identity-info'
import { updateBasicInfo } from './update-basic-info'
import { updateFamilyMemberInfo } from './update-family-member'
import { updateHousingInfo } from './update-housing-info'
import { uploadDocument } from './upload-documents'

export async function candidateRoutes(app: FastifyInstance) {
  /** Basic Info */
  app.post('/', registerCandidate)
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicInfo)
  app.patch('/basic-info', { onRequest: [verifyJWT] }, updateBasicInfo)

  /** Identity Info */
  app.get('/identity-info', { onRequest: [verifyJWT] }, getIdentityInfo)
  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
  app.patch('/identity-info', { onRequest: [verifyJWT] }, updateIdentityInfo)

  /** Housing Info */
  app.post('/housing-info', { onRequest: [verifyJWT] }, registerHousingInfo)
  app.patch('/housing-info', { onRequest: [verifyJWT] }, updateHousingInfo)

  /** Family Member Info */
  app.post(
    '/family-member',
    { onRequest: [verifyJWT] },
    registerFamilyMemberInfo,
  )
  app.patch('/identity-info', { onRequest: [verifyJWT] }, updateIdentityInfo)
  app.patch('/basic-info', { onRequest: [verifyJWT] }, updateBasicInfo)
  app.patch(
    '/family-info/:CPF?',
    { onRequest: [verifyJWT] },
    updateFamilyMemberInfo,
  )
  app.patch('/housing-info', { onRequest: [verifyJWT] }, updateHousingInfo)

  app.post('/upload', { onRequest: [verifyJWT] }, uploadDocument)
}
