import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import createCall from './Call Routes/create-call'
import createCallMessage from './Call Routes/create-call-message'
import finishCall from './Call Routes/finish-call'
import getCalls from './Call Routes/get-calls'
import getOpenCalls from './Call Routes/get-open-calls'
import linkOpenCall from './Call Routes/link-open-call'
import getBenefitsInformation from './get-benefits-information'


export async function userRoutes(app: FastifyInstance) {
    app.get('/call/:call_id?', { onRequest: [verifyJWT] }, getCalls)
    app.post('/call/:call_id', { onRequest: [verifyJWT] }, createCallMessage)
    app.get('/call/unsolved', { onRequest: [verifyJWT] }, getOpenCalls)
    app.put('/call/link', { onRequest: [verifyJWT] }, linkOpenCall)
    app.put('/call/finish', { onRequest: [verifyJWT] }, finishCall)
    app.post('/call', { onRequest: [verifyJWT] }, createCall)

    app.get('/benefits/:application_id', { onRequest: [verifyJWT] }, getBenefitsInformation)
}
