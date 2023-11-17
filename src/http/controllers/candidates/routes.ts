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
import { getCandidateProfilePicture } from './get-profile-picture'
import { uploadCandidateProfilePicture } from './upload-profile-picture'
import { getOpenAnnouncements } from './get-open-announcements'
import { getApplications } from './get-applications'
import { registerExpensesInfo } from './register-expenses-info'
import { getExpensesInfo } from './get-expenses'
import { registerLoanInfo } from './register-loan-info'
import { getLoanInfo } from './get-loan-info'
import { registerFinancingInfo } from './register-financing-info'
import { getFinancingInfo } from './get-financing-info'
import { registerCreditCardInfo } from './register-credit-card-info'
import { getCreditCardInfo } from './get-credit-card-info'
import { getDocumentsPDF } from './get-pdf-documents'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/upload', { onRequest: [verifyJWT] }, uploadDocument)
  app.post(
    '/upload/:solicitation_id',
    { onRequest: [verifyJWT] },
    uploadSolicitationDocument,
  )
  app.get('/documents', { onRequest: [verifyJWT] }, getDocumentsPDF)

  /** Basic Info */
  app.post('/', registerCandidate)
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicInfo)
  app.patch('/basic-info', { onRequest: [verifyJWT] }, updateBasicInfo)

  /** Identity Info */
  app.get('/identity-info', { onRequest: [verifyJWT] }, getIdentityInfo)
  app.post('/identity-info', { onRequest: [verifyJWT] }, registerIdentityInfo)
  app.patch('/identity-info', { onRequest: [verifyJWT] }, updateIdentityInfo)

  /** Housing Info */
  app.get('/housing-info/:_id?', { onRequest: [verifyJWT] }, getHousingInfo)
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
  app.get('/vehicle-info/:_id?', { onRequest: [verifyJWT] }, getVehicleInfo)
  app.post(
    '/vehicle-info',
    { onRequest: [verifyJWT] },
    registerVehicleInfo,
  )

  app.post(
    '/application/:announcement_id/:educationLevel_id',
    { onRequest: [verifyJWT, verifyRole('CANDIDATE')] },
    subscribeAnnouncement,
  )
  app.post(
    '/application/see/:application_id?',
    { onRequest: [verifyJWT] },
    getApplications,
  )
  /** Rota para pegar todos os editais abertos  */
  app.get(
    '/anouncements/:announcement_id?',
    { onRequest: [verifyJWT] },
    getOpenAnnouncements,
  )

 //Despesas
  app.post('/expenses', { onRequest: [verifyJWT] }, registerExpensesInfo)
  app.get('/expenses/:_id?', { onRequest: [verifyJWT] }, getExpensesInfo)
  
  //Empréstimos
  app.post('/expenses/loan/:_id', { onRequest: [verifyJWT] }, registerLoanInfo )
  app.get('/expenses/loan/:_id?', { onRequest: [verifyJWT] }, getLoanInfo )
  
  //Financiamento
  app.post('/expenses/financing/:_id' , { onRequest: [verifyJWT] }, registerFinancingInfo)
  app.get('/expenses/financing/:_id?' , { onRequest: [verifyJWT] }, getFinancingInfo)

  // Cartão de Crédito
  app.post('/expenses/credit-card/:_id' , { onRequest: [verifyJWT] }, registerCreditCardInfo)
  app.get('/expenses/credit-card/:_id?' , { onRequest: [verifyJWT] }, getCreditCardInfo)
    


  // profile ficture info
  app.get(
    '/profilePicture',
    { onRequest: [verifyJWT] },
    getCandidateProfilePicture,
  )
  app.post(
    '/profilePicture',
    { onRequest: [verifyJWT] },
    uploadCandidateProfilePicture,
  )
}
