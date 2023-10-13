import { FastifyInstance } from 'fastify'
import { registerEntity } from './register'
import { createEntitySubsidiary } from './create-subsidiary'
import { fetchEntities } from './fetch-entities'
import { fetchEntitySubsidiary } from './fetch-subsidiarys'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createSubsidiaryDirector } from './create-subsidiary-director'
import { getSubsidiaryDirector } from './get-subsidiary-director'
import { createSelectionProcessResponsible } from './create-selection-proces-responsible'

export async function entityRoutes(app: FastifyInstance) {
  app.post('/', registerEntity) // Essa rota vai para o admin
  app.get('/:entity_id?', fetchEntities) // Essa rota vai para o admin

  /** Entity Routes (Rotas acessadas na página do Admin)
   *  Concluídas: post, get
   *   Faltam:  update, delete, adicionar verificação de ROLE -> ENTITY
   */
  app.post('/subsidiary', { onRequest: [verifyJWT] }, createEntitySubsidiary)
  app.get(
    '/subsidiary/:subsidiary_id?',
    { onRequest: [verifyJWT] },
    fetchEntitySubsidiary,
  )

  app.post(
    '/director/:entity_subsidiary_id',
    { onRequest: [verifyJWT] },
    createSubsidiaryDirector,
  )
  app.get(
    '/director/:entity_subsidiary_id',
    { onRequest: [verifyJWT] },
    getSubsidiaryDirector,
  )

  app.post(
    '/selection-responsible/subsidiary_id',
    { onRequest: [verifyJWT] },
    createSelectionProcessResponsible,
  )
}
