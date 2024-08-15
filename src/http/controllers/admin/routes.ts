import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { registerAdmin } from './register'
import { verifyRole } from '@/http/middlewares/verify-role'
import { seeEntities } from './see-entities'
import getCalls from './Call Routes/get-calls'
import createCallMessage from './Call Routes/create-call-message'
import closeCall from './Call Routes/close-call'


export async function adminRoutes(app: FastifyInstance) {
  app.post('/', registerAdmin)
  app.get('/entidades/:entity_id?', {onRequest: [verifyJWT, verifyRole("ADMIN")]}, seeEntities)
  app.get('/call/:call_id?', {onRequest: [verifyJWT, verifyRole("ADMIN")]}, getCalls)
  app.post('/call/:call_id', {onRequest: [verifyJWT, verifyRole("ADMIN")]}, createCallMessage)
  app.patch('/call/:call_id', {onRequest: [verifyJWT, verifyRole("ADMIN")]}, closeCall)
}
