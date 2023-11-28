import { FastifyInstance } from 'fastify'
import { registerEntity } from './register-entity'
import { createSubsidiary } from './create-subsidiary'
import { getEntityInfo } from './get-entity-info'
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
import { addAssistantAnnouncement } from './add-social-assistant-to-announcement'
import { fetchAnnouncements } from './fetch-announcements'
import { uploadAnnouncementPdf } from './upload-announcement-pdf'
import { uploadEntityProfilePicture } from './upload-profile-picture'
import { getEntityProfilePicture } from './get-profile-picture'
import { getSocialAssistants } from './get-social-assistants'
import { getApplications } from './get-applications'

export async function entityRoutes(app: FastifyInstance) {
  /** Admin Routes (Rotas acessadas na página do Admin)
   *  Concluídas: post, get, delete, update, Verificação de ROLE -> ADMIN
   *   Faltam:
   */
  app.post('/',{ onRequest: [verifyJWT, verifyRole('ADMIN')] }, registerEntity) // Adicionar middlewares
  app.get('/', { onRequest: [verifyJWT] }, getEntityInfo)
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
  app.post('/subsidiary', { onRequest: [verifyJWT] }, createSubsidiary)
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
  app.get('/announcement/assistant', { onRequest: [verifyJWT]}, getSocialAssistants)

  app.post('/announcement/assistant',{ onRequest: [verifyJWT]},  addAssistantAnnouncement)

  app.post(
    '/announcement',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    CreateAnnoucment,
  )
  app.post('/upload/:announcement_id' , { onRequest: [verifyJWT, verifyRole('ENTITY')]}, uploadAnnouncementPdf)
  app.get(
    '/announcement/:announcement_id?',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    fetchAnnouncements,
  )
  app.patch(
    '/announcement/:announcement_id',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    updateAnnouncement,
  )
  app.post(
    '/education/:announcement_id',
    { onRequest: [verifyJWT, verifyRole('ENTITY')] },
    createEducationalLevel,
  )

  app.post('/profilePicture', {onRequest: [verifyJWT]}, uploadEntityProfilePicture)
  app.get('/profilePicture/:_id?', {onRequest: [verifyJWT]}, getEntityProfilePicture)
  app.get(
    '/applications/:announcement_id',
    { onRequest: [verifyJWT] },
    getApplications,
  )
}
