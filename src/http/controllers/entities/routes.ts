import { FastifyInstance } from 'fastify'
import { registerEntity } from './register'
import { createEntitySubsidiary } from './create-subsidiary-entity'
import { fetchEntities } from './fetch-entities'
import { fetchEntitySubsidiary } from './fetch-entity-subsidiary'
import { deleteEntity } from './delete-entity'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function entityRoutes(app: FastifyInstance) {
  app.post('/', registerEntity)
  app.get('/', fetchEntities)
  app.delete('/:entity_id', deleteEntity)

  app.post('/subsidiary', { onRequest: [verifyJWT] }, createEntitySubsidiary)
  app.get('/subsidiary', { onRequest: [verifyJWT] }, fetchEntitySubsidiary)
}
