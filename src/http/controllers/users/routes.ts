import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import getCalls from './Call Routes/get-calls'
import createCallMessage from './Call Routes/create-call-message'
import createCall from './Call Routes/create-call'



export async function userRoutes(app: FastifyInstance) {
    app.get('/call/:call_id?', { onRequest: [verifyJWT] }, getCalls)
    app.post('/call/:call_id', { onRequest: [verifyJWT] }, createCallMessage)
    app.post('/call', { onRequest: [verifyJWT] }, createCall)
}
