import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyRole } from '@/http/middlewares/verify-role'
import { FastifyInstance } from 'fastify'
import closeCall from './Call Routes/close-call'
import createCallMessage from './Call Routes/create-call-message'
import getCalls from './Call Routes/get-calls'
import changeAccountActiveStatus from './change-account-active-status'
import getAccountHistory from './get-account-history'
import getAccountInformation from './get-account-information'
import getAccounts from './get-accounts'
import { registerAdmin } from './register'
import { seeEntities } from './see-entities'


export async function adminRoutes(app: FastifyInstance) {
  app.post('/', registerAdmin)
  app.get('/entidades/:entity_id?', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, seeEntities)
  app.get('/call/:call_id?', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, getCalls)
  app.post('/call/:call_id', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, createCallMessage)
  app.patch('/call/:call_id', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, closeCall)
  app.get('/accounts', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, getAccounts)
  app.get('/accounts/:user_id', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, getAccountInformation)
  app.get('/accounts/history/:user_id', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, getAccountHistory)
  app.put('/accounts/active/:user_id', { onRequest: [verifyJWT, verifyRole(["ADMIN"])] }, changeAccountActiveStatus)
}
