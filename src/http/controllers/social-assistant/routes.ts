import verifyAssistantAnnouncement from '@/http/middlewares/assistant/verify-assistant-announcement'
import verifyAssistantEnroll from '@/http/middlewares/verify-assistant-enroll'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { addHistory } from './add-history'
import getScholarshipsByLevel from './administrative/get-sholarships-by-level'
import getType1Benefits from './administrative/get-type1-benefits'
import getType2Benefits from './administrative/get-type2-benefits'
import updateScholarshipGranted from './administrative/update-scholarship-granted'
import updateType1Benefits from './administrative/update-type1-benefits'
import updateType2Benefits from './administrative/update-type2-benetifts'
import { uploadMarojacaoDocument } from './AWS-routes/upload-majoracao-document'
import { uploadParecerDocument } from './AWS-routes/upload-parecer-document'
import { uploadSolicitationDocument } from './AWS-routes/upload-solicitation-document'
import { calculateExpenses } from './calculate-expenses'
import { createSolicitation } from './create-solicitation'
import { deleteSolicitation } from './delete-solicitation'
import { getBankingInfoHDB } from './detailed-form/get-banking-info'
import { getBasicInfoHDB } from './detailed-form/get-basic-info'
import { getDeclarationsPDF } from './detailed-form/get-declarations'
import { getExpensesInfoHDB } from './detailed-form/get-expenses'
import { getFamilyMemberInfoHDB } from './detailed-form/get-family-member-info'
import { getHealthInfoHDB } from './detailed-form/get-health-info'
import { getHousingInfoHDB } from './detailed-form/get-housing-info'
import { getIdentityInfoHDB } from './detailed-form/get-identity-info'
import { getIncomeInfoHDB } from './detailed-form/get-income-info'
import { getMonthlyIncomeBySourceHDB } from './detailed-form/get-monthly-income'
import { getRegistratoHDB } from './detailed-form/get-registrato'
import { getVehicleInfoHDB } from './detailed-form/get-vehicle-info'
import { enrollApplication } from './enrol-application'
import { findCPF_CNPJ } from './find-cpf-cnpj'
import { getAnnouncements } from './get-announcements'
import { getApplications } from './get-applications'
import { getCandidateIncome } from './get-candidate-income'
import { getCandidateParecer } from './get-candidate-parecer'
import { getCandidateResume } from './get-candidate-resume'
import getCandidatesApplications from './get-candidates-applications'
import getAssistantDashboard from './get-dashboard'
import { getDocumentsPDF } from './get-pdf-documents'
import getScheduleSummary from './get-schedule-summary'
import { getBasicAssistantInfo } from './get-social-assistant-information'
import { getSolicitationDocumentsPDF } from './get-solicitation-response'
import { getSolicitations } from './get_solicitations'
import { registerAssistant } from './register'
import { resendParecerDocumentEmail } from './resend-parecer-email-to-sign'
import createInterviewSchedule from './schedule-routes/create-interview-schedule'
import getAnnouncementSchedule from './schedule-routes/get-announcement-schedules'
import getAssistantSchedule from './schedule-routes/get-schedule'
import rejectInterview from './schedule-routes/reject-interview'
import updateInterviewSchedule from './schedule-routes/update-interview-schedule'
import updateSingularInterview from './schedule-routes/update-singular-interview'
import { sendParecerDocumentToSign } from './send-parecer-document-to-sign'
import { updateApplication } from './update-application'
import updateAssistantProfile from './update-assistant-profile'
import { updateSolicitationWithReport } from './update-solicitation-report'
import getPartialReport from './administrative/get-partial-report'
import getFullReport from './administrative/get-full-report'
import getNominalReport from './administrative/get-nominal-report'
export async function assistantRoutes(app: FastifyInstance) {
  // Registro
  app.post('/', { onRequest: [verifyJWT] }, registerAssistant)
  app.patch('/update-profile', { onRequest: [verifyJWT] }, updateAssistantProfile)

  // Pegar inscrições e escolher uma inscrição
  app.get(
    '/:announcement_id/:application_id?',
    { onRequest: [verifyJWT] },
    getApplications,
  )
  app.post(
    '/:announcement_id/:application_id',
    { onRequest: [verifyJWT] },
    enrollApplication,
  )

  // Adicionar histórico na inscrição
  app.post('/history/:application_id', { onRequest: [verifyJWT] }, addHistory)
  // Pegar documentos do candidato
  app.get(
    '/documents/:announcement_id/:application_id',
    { onRequest: [verifyJWT] },
    getDocumentsPDF,
  )

  // Solicitações
  app.get(
    '/solicitation/:application_id/:solicitation_id?',
    { onRequest: [verifyJWT] },
    getSolicitations,
  )
  app.get(
    '/solicitationDocuments/:application_id/:solicitation_id',
    { onRequest: [verifyJWT] },
    getSolicitationDocumentsPDF,
  )
  app.post(
    '/solicitation/:application_id',
    { onRequest: [verifyJWT, verifyAssistantEnroll] },
    createSolicitation,
  )
  app.delete(
    '/solicitation/:application_id/:id',
    { onRequest: [verifyJWT, verifyAssistantEnroll] },
    deleteSolicitation,
  )
  app.patch('/solicitation/:solicitation_id',
    { onRequest: [verifyJWT, verifyAssistantEnroll] },
    updateSolicitationWithReport
  )


  app.patch(
    '/application/:application_id',
    { onRequest: [verifyJWT, verifyAssistantEnroll] },
    updateApplication,
  )

  app.get(
    '/announcement/:announcement_id?',
    { onRequest: [verifyJWT] },
    getAnnouncements,
  )
  app.get('/applications/:educationLevel_id', { onRequest: [verifyJWT] }, getCandidatesApplications)

  //Despesas Candidato Inscrito
  app.get('/expenses/:candidate_id', { onRequest: [verifyJWT] }, calculateExpenses)
  app.get('/income/:candidate_id', { onRequest: [verifyJWT] }, getCandidateIncome)
  // informações
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicAssistantInfo)






  // Pegar informações do candidato
  // Extrato (informações resumidas):
  app.get('/candidateInfo/resume/:application_id', { onRequest: [verifyJWT] }, getCandidateResume)
  //Parecer
  app.get('/candidateInfo/parecer/:application_id', { onRequest: [verifyJWT] }, getCandidateParecer)
  // Formulário detalhado
  app.get('/candidateInfo/identity/:application_id', { onRequest: [verifyJWT] }, getIdentityInfoHDB)
  app.get('/candidateInfo/basic/:application_id', { onRequest: [verifyJWT] }, getBasicInfoHDB)
  app.get('/candidateInfo/family/:application_id', { onRequest: [verifyJWT] }, getFamilyMemberInfoHDB)
  app.get('/candidateInfo/housing/:application_id', { onRequest: [verifyJWT] }, getHousingInfoHDB)
  app.get('/candidateInfo/income/:application_id', { onRequest: [verifyJWT] }, getIncomeInfoHDB)
  app.get('/candidateInfo/monthly-income/:application_id/:_id', { onRequest: [verifyJWT] }, getMonthlyIncomeBySourceHDB)
  app.get('/candidateInfo/health/:application_id', { onRequest: [verifyJWT] }, getHealthInfoHDB)
  app.get('/candidateInfo/vehicle/:application_id', { onRequest: [verifyJWT] }, getVehicleInfoHDB)
  app.get('/candidateInfo/expenses/:application_id', { onRequest: [verifyJWT] }, getExpensesInfoHDB)
  app.get('/candidateInfo/bank-info/:application_id/:_id?', { onRequest: [verifyJWT] }, getBankingInfoHDB)
  app.get('/candidateInfo/registrato/:application_id/:_id?', { onRequest: [verifyJWT] }, getRegistratoHDB)
  app.get('/candidateInfo/declaration/:application_id', { onRequest: [verifyJWT] }, getDeclarationsPDF)

  // Documentos da assistente
  app.post('/documents/majoracao/:application_id', { onRequest: [verifyJWT, verifyAssistantEnroll] }, uploadMarojacaoDocument)
  app.post('/documents/parecer/:application_id', { onRequest: [verifyJWT, verifyAssistantEnroll] }, uploadParecerDocument)
  app.post('/documents/solicitation/:type/:application_id', { onRequest: [verifyJWT, verifyAssistantEnroll] }, uploadSolicitationDocument)
  // Pegar CPF-CNPJ
  app.get('/candidateInfo/find-cpf-cnpj/:application_id', { onRequest: [verifyJWT, verifyAssistantEnroll] }, findCPF_CNPJ)

  app.post('/post-pdf/:application_id', { onRequest: [verifyJWT, verifyAssistantEnroll] }, sendParecerDocumentToSign)
  app.post('/send-parecer-email/:application_id', { onRequest: [verifyJWT, verifyAssistantEnroll] }, resendParecerDocumentEmail)


  // Agenda
  app.get('/schedule', { onRequest: [verifyJWT] }, getAssistantSchedule)
  app.get('/schedule/summary', { onRequest: [verifyJWT] }, getScheduleSummary)
  app.post('/schedule/:announcement_id', { onRequest: [verifyJWT] }, createInterviewSchedule)
  app.patch('/schedule/:schedule_id', { onRequest: [verifyJWT] }, updateInterviewSchedule)
  app.post('/schedule/not-accept/:interview_id', { onRequest: [verifyJWT] }, rejectInterview)
  app.patch('/schedule/interview/:interview_id', { onRequest: [verifyJWT] }, updateSingularInterview)
  app.get('/schedule/:announcement_id/:schedule_id?', { onRequest: [verifyJWT] }, getAnnouncementSchedule)

  app.get('/dashboard', { onRequest: [verifyJWT] }, getAssistantDashboard)


  // Gerencial administrativo

  app.get('/administrative/scholarships/:educationLevel_id', { onRequest: [verifyJWT, verifyAssistantAnnouncement] }, getScholarshipsByLevel)
  app.get('/administrative/type1/:educationLevel_id', { onRequest: [verifyJWT, verifyAssistantAnnouncement] }, getType1Benefits)
  app.post('/administrative/type1/:educationLevel_id', { onRequest: [verifyJWT, verifyAssistantAnnouncement] }, updateType1Benefits)
  app.post('/administrative/scholarships/:scholarship_id', { onRequest: [verifyJWT] }, updateScholarshipGranted)
  app.get('/administrative/type2/:scholarship_id/:candidate_id', { onRequest: [verifyJWT, verifyAssistantAnnouncement] }, getType2Benefits)
  app.post('/administrative/type2/:scholarship_id', { onRequest: [verifyJWT, verifyAssistantAnnouncement] }, updateType2Benefits)
  app.get('/administrative/report/partial/:announcement_id/:entity_id', { onRequest: [verifyJWT,verifyAssistantAnnouncement] }, getPartialReport)

  app.get('/administrative/report/full/:announcement_id', { onRequest: [verifyJWT,verifyAssistantAnnouncement] }, getFullReport)
  app.get('/administrative/report/nominal/:announcement_id/:entity_id', { onRequest: [verifyJWT,verifyAssistantAnnouncement] }, getNominalReport)
}
