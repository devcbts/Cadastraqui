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
import { getHousingInfo } from './get-housing-info'
import { getFamilyMemberInfo } from './get-family-member-info'
import { getHealthInfo } from './get-health-info'
import { registerHealthInfo } from './register-health-info'
import { getVehicleInfo } from './get-vehicle-info'
import { registerVehicleInfo } from './register-vehicle-info'
import { downloadFile } from '@/http/services/download-file'
import { downloadDocument } from './download-documents'
import { subscribeAnnouncement } from './create-application'
import { verifyRole } from '@/http/middlewares/verify-role'
import { uploadSolicitationDocument } from './upload-solicitation-documents'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/upload', { onRequest: [verifyJWT] }, uploadDocument)
  app.post(
    '/upload/:solicitation_id',
    { onRequest: [verifyJWT] },
    uploadSolicitationDocument,
  )

  /** Basic Info */
  app.post('/', registerCandidate)
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicInfo)
  app.patch('/basic-info', { onRequest: [verifyJWT] }, updateBasicInfo)

  /** Identity Info */
  app.get('/identity-info', { onRequest: [verifyJWT] }, getIdentityInfo)
  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
  app.patch('/identity-info', { onRequest: [verifyJWT] }, updateIdentityInfo)

  /** Housing Info */
  app.get('/housing-info', { onRequest: [verifyJWT] }, getHousingInfo)
  app.post('/housing-info', { onRequest: [verifyJWT] }, registerHousingInfo)
  app.patch('/housing-info', { onRequest: [verifyJWT] }, updateHousingInfo)

  /** Family Member Info */
  app.get(
    '/family-member/:_id?',
    { onRequest: [verifyJWT] },
    getFamilyMemberInfo,
  )
  app.post(
    '/family-member',
    { onRequest: [verifyJWT] },
    registerFamilyMemberInfo,
  )
  app.patch(
    '/family-info/:CPF?',
    { onRequest: [verifyJWT] },
    updateFamilyMemberInfo,
  )

  /** Health Info */
  app.get('/health-info', { onRequest: [verifyJWT] }, getHealthInfo)
  app.post('/health-info/:_id', { onRequest: [verifyJWT] }, registerHealthInfo)

  /** Vehicle Info */
  app.get('/vehicle-info', { onRequest: [verifyJWT] }, getVehicleInfo)
  app.post(
    '/vehicle-info/:_id',
    { onRequest: [verifyJWT] },
    registerVehicleInfo,
  )

  app.post(
    '/application/:announcement_id/:educationLevel_id',
    { onRequest: [verifyJWT, verifyRole('CANDIDATE')] },
    subscribeAnnouncement,
  )
}
