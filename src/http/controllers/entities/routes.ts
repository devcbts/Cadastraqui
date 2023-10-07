import { FastifyInstance } from 'fastify'
import { registerEntity } from './register'
import { createEntityMatrix } from './create-matrix-entity'
import { createEntitySubsidiary } from './create-subsidiary-entity'

export async function entityRoutes(app: FastifyInstance) {
  app.post('/', registerEntity)
  app.post('/matrix', createEntityMatrix)
  app.post('/subsidiary', createEntitySubsidiary)
}
