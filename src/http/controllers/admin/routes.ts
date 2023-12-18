import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { registerAdmin } from './register'
import { verifyRole } from '@/http/middlewares/verify-role'
import { seeEntities } from './see-entities'


export async function adminRoutes(app: FastifyInstance) {
  app.post('/', registerAdmin)
  app.get('/entidades/:entity_id?', {onRequest: [verifyJWT, verifyRole("ADMIN")]}, seeEntities)
}
