import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'
import { getBasicsCandidateInfo } from './get-basic-candidate-info'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerIdentityInfo } from './register-identity-info'
import { registerHousingInfo } from './register-housing-info'
import { registerFamilyMemberInfo } from './register-family-member'
import { getIdentityCandidateInfo } from './get-identity-candidate-info'
import {updateIdentityInfo} from './update-identity-candidate-info'
import { updateBasicsCandidateInfo } from './update-basic-candidate-info'
import { updateFamilyMemberInfo } from './update-family-member'
import { updateHousingInfo } from './update-housing-info'
import { uploadDocument } from './upload-documents'




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
  app.patch("/identity-info",{onRequest: [verifyJWT]}, updateIdentityInfo)
  app.patch("/basic-info", {onRequest : [verifyJWT]}, updateBasicsCandidateInfo)
  app.patch("/family-info/:CPF?", {onRequest : [verifyJWT]}, updateFamilyMemberInfo)
  app.patch("/housing-info", {onRequest : [verifyJWT]}, updateHousingInfo)

  app.post("/upload", {onRequest : [verifyJWT] }, uploadDocument)
}
