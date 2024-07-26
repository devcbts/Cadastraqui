import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { addHistory } from './add-history'
import { uploadMarojacaoDocument } from './AWS-routes/upload-majoracao-document'
import { uploadSolicitationDocument } from './AWS-routes/upload-solicitation-document'
import { calculateExpenses } from './calculate-expenses'
import { closeApplication } from './close-application'
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
import { getDocumentsPDF } from './get-pdf-documents'
import { getBasicAssistantInfo } from './get-social-assistant-information'
import { getSolicitationDocumentsPDF } from './get-solicitation-response'
import { getSolicitations } from './get_solicitations'
import { rankCandidatesIncome } from './rank-candidates-income'
import { registerAssistant } from './register'
import { updateApplication } from './update-application'
import updateAssistantProfile from './update-assistant-profile'
import { updateSolicitationWithReport } from './update-solicitation-report'
import { sendParecerDocumentToSign } from './send-parecer-document-to-sign'
import { resendParecerDocumentEmail } from './resend-parecer-email-to-sign'
import { uploadParecerDocument } from './AWS-routes/upload-parecer-document'
import createInterviewSchedule from './create-interview-schedule'
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
  // Rankear os candidatos por menor renda
  app.get(
    '/rank-income/:announcement_id',
    { onRequest: [verifyJWT] },
    rankCandidatesIncome,
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
    { onRequest: [verifyJWT] },
    createSolicitation,
  )
  app.delete(
    '/solicitation/:application_id/:id',
    { onRequest: [verifyJWT] },
    deleteSolicitation,
  )
  app.patch('/solicitation/:solicitation_id',
    { onRequest: [verifyJWT] },
    updateSolicitationWithReport
  )

  // Fechar inscrição
  app.post(
    '/close/:announcement_id/:application_id',
    { onRequest: [verifyJWT] },
    closeApplication,
  )
  app.patch(
    '/application/:application_id',
    { onRequest: [verifyJWT] },
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
  app.post('/documents/majoracao/:application_id', { onRequest: [verifyJWT] }, uploadMarojacaoDocument)
  app.post('/documents/parecer/:application_id', { onRequest: [verifyJWT] }, uploadParecerDocument)
  app.post('/documents/solicitation/:type/:application_id', { onRequest: [verifyJWT] }, uploadSolicitationDocument)
  // Pegar CPF-CNPJ
  app.get('/candidateInfo/find-cpf-cnpj/:application_id', { onRequest: [verifyJWT] }, findCPF_CNPJ)

  app.post('/post-pdf/:application_id', { onRequest: [verifyJWT] }, sendParecerDocumentToSign)
  app.post('/send-parecer-email/:application_id', { onRequest: [verifyJWT] }, resendParecerDocumentEmail)


  // Agenda
  app.post('/schedule/:announcement_id', { onRequest: [verifyJWT] }, createInterviewSchedule)
}
