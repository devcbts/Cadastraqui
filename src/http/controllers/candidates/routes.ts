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
import { getDocumentsPDF } from './get-pdf-documents'
import { registerAutonomousInfo } from './register-autonomous-info'
import { registerMonthlyIncomeInfo } from './register-monthly-income-info'
import { registerMedicationInfo } from './register-medication-info'
import { registerExpensesInfo } from './register-expenses-info'
import { getExpensesInfo } from './get-expenses'
import { registerLoanInfo } from './register-loan-info'
import { getLoanInfo } from './get-loan-info'
import { registerFinancingInfo } from './register-financing-info'
import { getFinancingInfo } from './get-financing-info'
import { registerCreditCardInfo } from './register-credit-card-info'
import { getCreditCardInfo } from './get-credit-card-info'
import { getIncomeInfo } from './get-income-info'
import { registerMEIInfo } from './register-MEI-info'
import { getFamilyMemberHealthInfo } from './get-family-member-health-info'
import { registerCLTInfo } from './register-clt-income-info'
import { updateVehicleInfo } from './update-vehicle-info'
import { updateExpensesInfo } from './update-expenses-info'
import { updateFinancingInfo } from './update-financing-info'
import { updateCreditCardInfo } from './update-credit-card-info'
import { updateLoanInfo } from './update-loan-info'
import { registerEntepreneursInfo } from './register-entepreneur-info'
import { getMonthlyIncomeBySource } from './get-monthly-income'
import { finishRegistration } from './finish-registration'
import { getApplicationHistory } from './get-application-history'
import { getAnnouncementDocument } from './get-announcement-pdf'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/upload', { onRequest: [verifyJWT] }, uploadDocument)
  app.post(
    '/upload/:solicitation_id',
    { onRequest: [verifyJWT] },
    uploadSolicitationDocument,
  )
  app.get('/documents/:_id?', { onRequest: [verifyJWT] }, getDocumentsPDF)
  app.get('/documents/announcement/:announcement_id', { onRequest: [verifyJWT]}, getAnnouncementDocument)

  /** Basic Info */
  app.post('/', registerCandidate)
  app.get('/basic-info/:_id?', { onRequest: [verifyJWT] }, getBasicInfo)
  app.patch('/basic-info', { onRequest: [verifyJWT] }, updateBasicInfo)

  /** Identity Info */
  app.get('/identity-info/:_id?', { onRequest: [verifyJWT] }, getIdentityInfo)
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
  app.post(
    '/family-member/income/:_id',
    { onRequest: [verifyJWT] },
    registerMonthlyIncomeInfo,
  )
  app.patch(
    '/family-info/:_id',
    { onRequest: [verifyJWT] },
    updateFamilyMemberInfo,
  )
  // Income Info
  app.post(
    '/family-member/MEI/:_id',
    { onRequest: [verifyJWT] },
    registerMEIInfo,
  )

  app.get(
    '/family-member/income/:_id',
    { onRequest: [verifyJWT] },
    getIncomeInfo,
  )
  app.get(
    '/family-member/monthly-income/:_id',
    { onRequest: [verifyJWT] },
    getMonthlyIncomeBySource,
  )
  app.post(
    '/family-member/dependent-autonomous/:_id',
    { onRequest: [verifyJWT] },
    registerAutonomousInfo,
  )
  app.post(
    '/family-member/CLT/:_id',
    { onRequest: [verifyJWT] },
    registerCLTInfo,
  )

  app.post('/family-member/entepreneur/:_id', { onRequest: [verifyJWT] }, registerEntepreneursInfo)
  /** Health Info */
  // app.get('/health-info', { onRequest: [verifyJWT] }, getHealthInfo)
  app.get(
    '/health-info/family-member/:_id',
    { onRequest: [verifyJWT] },
    getFamilyMemberHealthInfo,
  )

  app.get('/health-info/:_id', { onRequest: [verifyJWT] }, getHealthInfo)

  app.post('/health-info/:_id', { onRequest: [verifyJWT] }, registerHealthInfo)
  app.post(
    '/medication-info/:_id',
    { onRequest: [verifyJWT] },
    registerMedicationInfo,
  )

  /** Vehicle Info */
  app.get('/vehicle-info/:_id?', { onRequest: [verifyJWT] }, getVehicleInfo)
  app.post('/vehicle-info', { onRequest: [verifyJWT] }, registerVehicleInfo)
  app.patch('/vehicle-info', { onRequest: [verifyJWT] }, updateVehicleInfo)
  app.post(
    '/application/:announcement_id/:educationLevel_id',
    { onRequest: [verifyJWT] },
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
  // Historico
  app.get('/application/history/:application_id', { onRequest: [verifyJWT] }, getApplicationHistory)
  // Despesas
  app.post('/expenses', { onRequest: [verifyJWT] }, registerExpensesInfo)
  app.get('/expenses/:_id?', { onRequest: [verifyJWT] }, getExpensesInfo)
  app.patch('/expenses', { onRequest: [verifyJWT] }, updateExpensesInfo)
  // Empréstimos
  app.post('/expenses/loan/:_id?', { onRequest: [verifyJWT] }, registerLoanInfo)
  app.get('/expenses/loan/:_id?', { onRequest: [verifyJWT] }, getLoanInfo)
  app.patch('/expenses/loan/:_id', { onRequest: [verifyJWT] }, updateLoanInfo)
  // Financiamento
  app.post(
    '/expenses/financing/:_id?',
    { onRequest: [verifyJWT] },
    registerFinancingInfo,
  )
  app.get(
    '/expenses/financing/:_id?',
    { onRequest: [verifyJWT] },
    getFinancingInfo,
  )
  app.patch('/expenses/financing', { onRequest: [verifyJWT] }, updateFinancingInfo)
  // Cartão de Crédito
  app.post(
    '/expenses/credit-card/:_id?',
    { onRequest: [verifyJWT] },
    registerCreditCardInfo,
  )
  app.get(
    '/expenses/credit-card/:_id?',
    { onRequest: [verifyJWT] },
    getCreditCardInfo,
  )
  app.patch('/expenses/credit-card', { onRequest: [verifyJWT] }, updateCreditCardInfo)
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

  //Terminar o cadastro
  app.post('/finish', { onRequest: [verifyJWT] }, finishRegistration)

}


