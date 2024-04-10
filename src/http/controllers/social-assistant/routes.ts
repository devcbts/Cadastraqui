import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { addHistory } from './add-history'
import { calculateExpenses } from './calculate-expenses'
import { closeApplication } from './close-application'
import { createSolicitation } from './create-solicitation'
import { enrollApplication } from './enrol-application'
import { getAnnouncements } from './get-announcements'
import { getApplications } from './get-applications'
import { getCandidateIncome } from './get-candidate-income'
import { getDocumentsPDF } from './get-pdf-documents'
import { getBasicAssistantInfo } from './get-social-assistant-information'
import { getSolicitationDocumentsPDF } from './get-solicitation-response'
import { getSolicitations } from './get_solicitations'
import { rankCandidatesIncome } from './rank-candidates-income'
import { registerAssistant } from './register'
import { updateApplication } from './update-application'
import updateAssistantProfile from './update-assistant-profile'
import { updateSolicitationWithReport } from './update-solicitation-report'
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
    '/:announcement_id/:application_id',
    { onRequest: [verifyJWT] },
    updateApplication,
  )

  app.get(
    '/announcement/:announcement_id?',
    { onRequest: [verifyJWT] },
    getAnnouncements,
  )

  //Despesas Candidato Inscrito
  app.get('/expenses/:candidate_id', { onRequest: [verifyJWT] }, calculateExpenses)
  app.get('/income/:candidate_id', { onRequest: [verifyJWT] }, getCandidateIncome)
  // informações
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicAssistantInfo)
}
