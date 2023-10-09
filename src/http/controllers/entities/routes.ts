import { FastifyInstance } from 'fastify'
import { registerEntity } from './register'
import { createEntityMatrix } from './create-matrix-entity'
import { createEntitySubsidiary } from './create-subsidiary-entity'
import { fetchEntities } from './fetch-entities'
import { getEntityMatrix } from './get-entity-matrix'
import { fetchEntitySubsidiary } from './fetch-entity-subsidiary'
import { deleteEntity } from './delete-entity'

export async function entityRoutes(app: FastifyInstance) {
  app.post('/', registerEntity)
  app.get('/', fetchEntities)
  app.delete('/:entity_id', deleteEntity)

  app.post('/matrix', createEntityMatrix)
  app.get('/matrix/:entity_id', getEntityMatrix)

  app.post('/subsidiary', createEntitySubsidiary)
  app.get('/subsidiary/:entity_matrix_id', fetchEntitySubsidiary)
}
