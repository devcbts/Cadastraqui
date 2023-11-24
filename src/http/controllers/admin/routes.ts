import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { registerAdmin } from './register'


export async function adminRoutes(app: FastifyInstance) {
  app.post('/', registerAdmin)
}
