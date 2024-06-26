import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { deleteDocument } from './AWS Routes/delete-document'
import { getDocumentsPDF } from './AWS Routes/get-pdf-documents'
import { getCandidateProfilePicture } from './AWS Routes/get-profile-picture'
import { uploadDocument } from './AWS Routes/upload-documents'
import { uploadCandidateProfilePicture } from './AWS Routes/upload-profile-picture'
import { uploadSolicitationDocument } from './AWS Routes/upload-solicitation-documents'
import { subscribeAnnouncement } from './create-application'
import getActivity from './Declaration Get Routes/get-activity'
import getAddressProof from './Declaration Get Routes/get-address-proof'
import getDeclarationForm from './Declaration Get Routes/get-declaration-form'
import getEmpresario from './Declaration Get Routes/get-empresario'
import getIncomeTaxExemption from './Declaration Get Routes/get-IncomeTaxExemption'
import getMEIDeclaration from './Declaration Get Routes/get-MEI'
import getRentIncome from './Declaration Get Routes/get-rent-income'
import getRuralWorker from './Declaration Get Routes/get-rural-worker'
import { deleteBankingInfo } from './delete-banking-info'
import deleteFamilyMember from './delete-family-member'
import { deleteHealthInfo } from './delete-health-info'
import { deleteMedicationInfo } from './delete-medication'
import { finishRegistration } from './finish-registration'
import { getAnnouncementDocument } from './get-announcement-pdf'
import { getApplicationHistory } from './get-application-history'
import { getApplications } from './get-applications'
import { getAvailableApplicants } from './get-available-applicants'
import { getBankingInfo } from './get-banking-info'
import { getBasicInfo } from './get-basic-info'
import { getCreditCardInfo } from './get-credit-card-info'
import getCandidateDashboard from './get-dashboard'
import { getDeclaration } from './get-declaration'
import { getExpensesInfo } from './get-expenses'
import { getFamilyMemberHealthInfo } from './get-family-member-health-info'
import { getFamilyMemberInfo } from './get-family-member-info'
import { getFinancingInfo } from './get-financing-info'
import { getHealthInfo } from './get-health-info'
import { getHousingInfo } from './get-housing-info'
import { getIdentityInfo } from './get-identity-info'
import { getIncomeInfo } from './get-income-info'
import { getLoanInfo } from './get-loan-info'
import { getMonthlyIncomeBySource } from './get-monthly-income'
import { getOpenAnnouncements } from './get-open-announcements'
import { getRegistrationProgress } from './get-registration-progress'
import { getRegistrato } from './get-registrato'
import { getBasicInfoFormated } from './get-user-basic-info-formated'
import { getVehicleInfo } from './get-vehicle-info'
import { registerCandidate } from './register'
import { registerBankingInfo } from './register-banking-info'
import { registerCreditCardInfo } from './register-credit-card-info'
import { registerDeclaration } from './register-declaration'
import { registerEmploymenType } from './register-employment-type'
import { registerExpensesInfo } from './register-expenses-info'
import { registerFamilyMemberInfo } from './register-family-member'
import { registerFinancingInfo } from './register-financing-info'
import { registerHealthInfo } from './register-health-info'
import { registerHousingInfo } from './register-housing-info'
import { registerIdentityInfo } from './register-identity-info'
import { registerLoanInfo } from './register-loan-info'
import { registerMedicationInfo } from './register-medication-info'
import { registerMonthlyIncomeInfo } from './register-monthly-income-info'
import { registerVehicleInfo } from './register-vehicle-info'
import { saveAnnouncement } from './save-announcement'
import { updateBankingInfo } from './update-banking-info'
import { updateBasicInfo } from './update-basic-info'
import { updateCreditCardInfo } from './update-credit-card-info'
import { updateExpensesInfo } from './update-expenses-info'
import { updateFamilyMemberInfo } from './update-family-member'
import { updateFinancingInfo } from './update-financing-info'
import { updateHealthInfo } from './update-health-info'
import { updateHousingInfo } from './update-housing-info'
import { updateIdentityInfo } from './update-identity-info'
import updateIncomeSource from './update-income-source'
import { updateLoanInfo } from './update-loan-info'
import { updateMedicationInfo } from './update-medication-info'
import { updateVehicleInfo } from './update-vehicle-info'
import getSolicitations from './get-solicitations'
import { answerSolicitation } from './answer-solicitation'
import { updateRegistrationInfo } from './update-registration-info'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/upload/:documentType/:member_id/:table_id?', { onRequest: [verifyJWT] }, uploadDocument)
 
  app.get('/documents/:_id?', { onRequest: [verifyJWT] }, getDocumentsPDF)
  app.get('/documents/announcement/:announcement_id', { onRequest: [verifyJWT] }, getAnnouncementDocument)
  app.post('/document/delete', { onRequest: [verifyJWT] }, deleteDocument)
  /** Basic Info */
  app.post('/', registerCandidate)
  app.get('/basic-info/:_id?', { onRequest: [verifyJWT] }, getBasicInfo)
  app.patch('/basic-info', { onRequest: [verifyJWT] }, updateBasicInfo)

  app.get('/basic-info/formated', { onRequest: [verifyJWT] }, getBasicInfoFormated)
  // Registration Progress
  app.get('/progress', { onRequest: [verifyJWT] }, getRegistrationProgress)
  app.patch('/progress/:section', { onRequest: [verifyJWT] }, updateRegistrationInfo)
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
  app.post('/update-income-source', { onRequest: [verifyJWT] }, updateIncomeSource)

  app.patch(
    '/family-info/:_id',
    { onRequest: [verifyJWT] },
    updateFamilyMemberInfo,
  )
  app.delete('/family-member', { onRequest: [verifyJWT] }, deleteFamilyMember)
  // Income Info
  app.post('/family-member/employmentType/:_id', { onRequest: [verifyJWT] }, registerEmploymenType)


  app.get(
    '/family-member/income',
    { onRequest: [verifyJWT] },
    getIncomeInfo,
  )
  app.get(
    '/family-member/monthly-income/:_id',
    { onRequest: [verifyJWT] },
    getMonthlyIncomeBySource,
  )
  // bank-info 
  app.get('/bank-info/:_id?', { onRequest: [verifyJWT] }, getBankingInfo)
  app.post('/bank-info/:_id', { onRequest: [verifyJWT] }, registerBankingInfo)
  app.patch('/bank-info/:_id', { onRequest: [verifyJWT] }, updateBankingInfo)
  app.delete('/bank-info/:id', { onRequest: [verifyJWT] }, deleteBankingInfo)
  // registrato
  app.get('/registrato/:_id', { onRequest: [verifyJWT] }, getRegistrato)


  /** Health Info */
  // app.get('/health-info', { onRequest: [verifyJWT] }, getHealthInfo)
  app.get(
    '/health-info/family-member/:_id',
    { onRequest: [verifyJWT] },
    getFamilyMemberHealthInfo,
  )

  app.get('/health-info', { onRequest: [verifyJWT] }, getHealthInfo)

  app.post('/health-info/:_id', { onRequest: [verifyJWT] }, registerHealthInfo)
  app.patch('/health-info/:_id', { onRequest: [verifyJWT] }, updateHealthInfo)
  app.delete('/health-info/:_id', { onRequest: [verifyJWT] }, deleteHealthInfo)

  app.post(
    '/medication-info/:_id',
    { onRequest: [verifyJWT] },
    registerMedicationInfo,
  )
  app.patch('/medication-info/:_id', { onRequest: [verifyJWT] }, updateMedicationInfo)
  app.delete('/medication-info/:_id', { onRequest: [verifyJWT] }, deleteMedicationInfo)





  /** Vehicle Info */
  app.get('/vehicle-info/:_id?', { onRequest: [verifyJWT] }, getVehicleInfo)
  app.post('/vehicle-info', { onRequest: [verifyJWT] }, registerVehicleInfo)
  app.patch('/vehicle-info/:_id', { onRequest: [verifyJWT] }, updateVehicleInfo)
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

  //get all available applicants based on user role 
  app.get('/applicants', { onRequest: [verifyJWT] }, getAvailableApplicants)
  app.get('/dashboard', { onRequest: [verifyJWT] }, getCandidateDashboard)
  //Terminar o cadastro
  app.post('/finish', { onRequest: [verifyJWT] }, finishRegistration)




  // Declaration Get Routes ( to create a declaration)
  app.get('/declaration/Form/:_id', { onRequest: [verifyJWT] }, getDeclarationForm)
  app.get('/declaration/AddressProof/:_id', { onRequest: [verifyJWT] }, getAddressProof)
  app.get('/declaration/MEI/:_id', { onRequest: [verifyJWT] }, getMEIDeclaration)
  app.get('/declaration/IncomeTaxExemption/:_id', { onRequest: [verifyJWT] }, getIncomeTaxExemption)
  app.get('/declaration/Empresario/:_id', { onRequest: [verifyJWT] }, getEmpresario)
  app.get('/declaration/RentIncome/:_id', { onRequest: [verifyJWT] }, getRentIncome)
  app.get('/declaration/Activity/:_id', { onRequest: [verifyJWT] }, getActivity)
  app.get('/declaration/RuralWorker/:_id', { onRequest: [verifyJWT] }, getRuralWorker)
  // Declaration post route
  app.post('/declaration/:type/:_id', { onRequest: [verifyJWT] }, registerDeclaration)

  // Get individual declaration
  app.get('/declaration/:type/:_id', { onRequest: [verifyJWT] }, getDeclaration)

  // Announcement Routes
  app.post('/announcement/save/:announcement_id', { onRequest: [verifyJWT] }, saveAnnouncement)
  app.post(
    '/application/:announcement_id/:educationLevel_id/:candidate_id?',
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
    '/announcements/:announcement_id?',
    { onRequest: [verifyJWT] },
    getOpenAnnouncements,
  )
  // Historico
  app.get('/application/history/:application_id', { onRequest: [verifyJWT] }, getApplicationHistory)

  // Solicitações
  app.get('/solicitation/:application_id?', { onRequest: [verifyJWT] }, getSolicitations)
  app.post('/solicitation/:solicitation_id', { onRequest: [verifyJWT] }, answerSolicitation)
  app.post(
    '/upload/:solicitation_id',
    { onRequest: [verifyJWT] },
    uploadSolicitationDocument,
  )
}


