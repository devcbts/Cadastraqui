import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { registerAssistant } from './register'
import { getApplications } from './get-applications'
import { addHistory } from './add-history'
import { getDocumentsPDF } from './get-pdf-documents'
import { enrollApplication } from './enrol-application'
import { getSolicitationDocumentsPDF } from './get-solicitation-response'
import { getSolicitations } from './get_solicitations'
import { createSolicitation } from './create-solicitation'
import { closeApplication } from './close-application'
import { getBasicAssistantInfo } from './get-social-assistant-information'
import { getAnnouncements } from './get-announcements'
import { updateApplication } from './update-application'
import { rankCandidatesIncome } from './rank-candidates-income'
import { calculateExpenses } from './calculate-expenses'
import { getCandidateIncome } from './get-candidate-income'
export async function assistantRoutes(app: FastifyInstance) {
  // Registro
  app.post('/', { onRequest: [verifyJWT] }, registerAssistant)

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
  app.get('/expenses/:candidate_id', {onRequest: [verifyJWT] }, calculateExpenses)
  app.get('/income/:candidate_id', {onRequest: [verifyJWT]} , getCandidateIncome)
  // informações
  app.get('/basic-info', { onRequest: [verifyJWT] }, getBasicAssistantInfo)
}
