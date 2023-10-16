import { FastifyInstance } from 'fastify'
import { registerEntity } from './register'
import { createSubsidiary } from './create-subsidiary'
import { fetchEntities } from './fetch-entities'
import { fetchSubsidiarys } from './fetch-subsidiarys'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createDirector } from './create-director'
import { fetchDirectors } from './fetch-directors'
import { deleteEntity } from './delete-entity'
import { verifyAdmin } from '@/http/middlewares/verify-admin'
import { patchDirector } from './patch-basic-director-info'
import { patchSubsidiary } from './patch-subsidiary'
import { CreateAnnoucment } from './create-announcement'
import { patchAnnouncement } from './patch-announcement'

export async function entityRoutes(app: FastifyInstance) {
  app.post('/', registerEntity) // Essa rota vai para o admin
  app.get('/:entity_id?', fetchEntities) // Essa rota vai para o admin
  app.delete('/:_id?', { onRequest: [verifyJWT, verifyAdmin] }, deleteEntity) // Essa rota vai para o admin

  /** Entity Routes (Rotas acessadas na página do Admin)
   *  Concluídas: post, get
   *   Faltam:  update, delete, adicionar verificação de ROLE -> ENTITY
   */
  app.post('/subsidiary', { onRequest: [verifyJWT] }, createSubsidiary)
  app.get(
    '/subsidiary/:subsidiary_id?',
    { onRequest: [verifyJWT] },
    fetchSubsidiarys,
  )
  app.patch('/subsidiary/:subsidiary_id', { onRequest: [verifyJWT]}, patchSubsidiary)

  app.post('/director/:_id', { onRequest: [verifyJWT] }, createDirector)
  app.get('/director/:_id', { onRequest: [verifyJWT] }, fetchDirectors)
  app.patch('/director/:_id/:director_id', { onRequest: [verifyJWT]}, patchDirector)

  app.post('/announcement', {onRequest: [verifyJWT]}, CreateAnnoucment)
  app.patch('/announcement/:announcement_id', {onRequest: [verifyJWT] }, patchAnnouncement )
}
