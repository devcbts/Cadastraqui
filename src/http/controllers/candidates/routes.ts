import { FastifyInstance } from 'fastify'
import { registerCandidate } from './register'

export async function candidateRoutes(app: FastifyInstance) {
  app.post('/', registerCandidate)
}
