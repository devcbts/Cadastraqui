import { FastifyInstance } from 'fastify'
import { registerEntity } from './register'

export async function entityRoutes(app: FastifyInstance) {
  app.post('/', registerEntity)
}
