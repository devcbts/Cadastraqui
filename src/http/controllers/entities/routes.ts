import { FastifyInstance } from 'fastify'
import { registerEntity } from './register-entity'
import { createSubsidiary } from './create-subsidiary'
import { fetchEntities } from './fetch-entities'
import { fetchSubsidiarys } from './fetch-subsidiarys'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createDirector } from './create-director'
import { fetchDirectors } from './fetch-directors'
import { deleteEntity } from './delete-entity'
import { verifyRole } from '@/http/middlewares/verify-role'
import { updateEntity } from './update-entity'
import { deleteSubsidiary } from './delete-subsidiary'
import { updateSubsidiary } from './update-subsidiary'
import { deleteDirector } from './delete-director'
import { updateDirector } from './update-director'
import { CreateAnnoucment } from './create-announcement'
import { updateAnnouncement } from './update-announcement'
import { createEducationalLevel } from './create-educcation-level'

export async function entityRoutes(app: FastifyInstance) {
  /** Admin Routes (Rotas acessadas na página do Admin)
   *  Concluídas: post, get, delete, update, Verificação de ROLE -> ADMIN
   *   Faltam:
   */
  app.post('/', registerEntity) // Adicionar middlewares
  app.get(
    '/:_id?',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    fetchEntities,
  )
  app.delete(
    '/:_id?',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    deleteEntity,
  )
  app.patch(
    '/:_id',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    updateEntity,
  )

  /** Entity Routes (Rotas acessadas na página da Entidade)
   *  Concluídas: post, get, delete
   *   Faltam: update,Verificação de ROLE -> ENTITY
   */
  app.post(
    '/subsidiary',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    createSubsidiary,
  )
  app.get(
    '/subsidiary/:_id?',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    fetchSubsidiarys,
  )
  app.delete(
    '/subsidiary/:_id',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    deleteSubsidiary,
  )
  app.patch(
    '/subsidiary/:_id',
    {
      onRequest: [verifyJWT, verifyRole('ENTITY')],
    },
    updateSubsidiary,
  )

  app.post(
    '/director/:_id?',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    createDirector,
  )
  app.get(
    '/director/:_id?',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    fetchDirectors,
  )
  app.patch(
    '/director/:_id',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    updateDirector,
  )
  app.delete(
    '/director/:_id',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    deleteDirector,
  )


  app.post('/announcement', {onRequest: [verifyJWT, verifyRole('ENTITY')]}, CreateAnnoucment)
  app.patch('/announcement/:announcement_id', {onRequest: [verifyJWT, verifyRole('ENTITY')] }, updateAnnouncement )
  app.post('/education/:announcement_id', {onRequest: [verifyJWT , verifyRole('ENTITY')]},createEducationalLevel)
}
