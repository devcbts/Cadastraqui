import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyRole } from '@/http/middlewares/verify-role'
import { FastifyInstance } from 'fastify'
import { addAssistantAnnouncement } from './add-social-assistant-to-announcement'
import { CreateAnnoucment } from './create-announcement'
import { createDirector } from './create-director'
import { createEducationalLevel } from './create-educcation-level'
import { createSubsidiary } from './create-subsidiary'
import { deleteAnnouncement } from './delete-announcement'
import { deleteAssistant } from './delete-assistant'
import { deleteDirector } from './delete-director'
import { deleteEntity } from './delete-entity'
import { deleteSubsidiary } from './delete-subsidiary'
import { fetchAnnouncements } from './fetch-announcements'
import { fetchClosedAnnouncements } from './fetch-closed-announcements'
import { fetchDirectors } from './fetch-directors'
import { fetchFilterAnnouncements } from './fetch-filter-announcement'
import { fetchSubsidiarys } from './fetch-subsidiarys'
import getAnnouncementCourse from './get-announcement-course'
import { getApplications } from './get-applications'
import getEntityDashboard from './get-dashboard'
import { getEntityInfo } from './get-entity-info'
import { getEntityProfilePicture } from './get-profile-picture'
import { getSocialAssistants } from './get-social-assistants'
import { registerEntity } from './register-entity'
import removeAssistantFromAnnouncement from './remove-assistant-from-announcement'
import searchAnnouncements from './search-announcements'
import { updateAnnouncement } from './update-announcement'
import { updateDirector } from './update-director'
import { updateEntity } from './update-entity'
import updateEntityProfile from './update-entity-profile'
import updateSocialAssistant from './update-social-assistant'
import { updateSubsidiary } from './update-subsidiary'
import { uploadAnnouncementPdf } from './upload-announcement-pdf'
import { uploadEntityProfilePicture } from './upload-profile-picture'
import uploadBasicEducationCSVFileToAnnouncement from './upload-basic-education-csv-to-announcement'
import uploadHigherEducationCSVFileToAnnouncement from './upload-higher-education-csv-to-announcement'

export async function entityRoutes(app: FastifyInstance) {
  /** Admin Routes (Rotas acessadas na página do Admin)
   *  Concluídas: post, get, delete, update, Verificação de ROLE -> ADMIN
   *   Faltam:
   */
  app.post('/', { onRequest: [verifyJWT, verifyRole(['ADMIN'])] }, registerEntity) // Adicionar middlewares
  app.get('/', { onRequest: [verifyJWT] }, getEntityInfo)
  app.delete(
    '/:_id?',
    { onRequest: [verifyJWT, verifyRole(['ADMIN'])] },
    deleteEntity,
  )
  app.patch(
    '/:_id',
    { onRequest: [verifyJWT, verifyRole(['ADMIN'])] },
    updateEntity,
  )
  app.patch(
    '/update-profile',
    { onRequest: [verifyJWT, verifyRole(['ENTITY'])] },
    updateEntityProfile,
  )

  /** Entity Routes (Rotas acessadas na página da Entidade)
   *  Concluídas: post, get, delete
   *   Faltam: update,Verificação de ROLE -> ENTITY
   */
  app.post('/subsidiary', { onRequest: [verifyJWT] }, createSubsidiary)
  app.get(
    '/subsidiary/:_id?',
    { onRequest: [verifyJWT] },
    fetchSubsidiarys,
  )
  app.delete(
    '/subsidiary/:_id',
    { onRequest: [verifyJWT] },
    deleteSubsidiary,
  )
  app.patch(
    '/subsidiary/:_id',
    {
      onRequest: [verifyJWT],
    },
    updateSubsidiary,
  )

  app.post(
    '/director/:_id?',
    { onRequest: [verifyJWT] },
    createDirector,
  )
  app.get(
    '/director/:_id?',
    { onRequest: [verifyJWT] },
    fetchDirectors,
  )
  app.patch(
    '/director/:_id',
    { onRequest: [verifyJWT] },
    updateDirector,
  )
  app.delete(
    '/director/:_id',
    { onRequest: [verifyJWT] },
    deleteDirector,
  )
  // Assistente
  app.get('/announcement/assistant', { onRequest: [verifyJWT] }, getSocialAssistants)

  app.post('/announcement/assistant', { onRequest: [verifyJWT] }, addAssistantAnnouncement)
  app.put('/announcement/assistant', { onRequest: [verifyJWT] }, removeAssistantFromAnnouncement)
  app.delete('/assistant/:_id', { onRequest: [verifyJWT] }, deleteAssistant)
  app.post('/assistant/update', { onRequest: [verifyJWT] }, updateSocialAssistant)
  // Edital
  app.post(
    '/announcement',
    { onRequest: [verifyJWT] },
    CreateAnnoucment,
  )
  app.post('/upload/:announcement_id', { onRequest: [verifyJWT] }, uploadAnnouncementPdf)

  // fetch announcements
  app.get(
    '/announcement/:announcement_id?',
    { onRequest: [verifyJWT] },
    fetchAnnouncements,
  )

  app.get('/announcement/search', { onRequest: [verifyJWT] }, fetchFilterAnnouncements)
  // app.get('/announcement/open/:page_number?', { onRequest: [verifyJWT] }, fetchOpenAnnouncements)
  app.get('/announcement/close/:page_number?', { onRequest: [verifyJWT] }, fetchClosedAnnouncements)
  app.get('/dashboard', { onRequest: [verifyJWT] }, getEntityDashboard)

  app.patch(
    '/announcement/:announcement_id',
    { onRequest: [verifyJWT] },
    updateAnnouncement,
  )
  app.post(
    '/announcement/find',
    searchAnnouncements,
  )
  app.post(
    '/education/:announcement_id',
    { onRequest: [verifyJWT] },
    createEducationalLevel,
  )
  app.delete('/announcement/:announcement_id', { onRequest: [verifyJWT] }, deleteAnnouncement)

  //Courses
  app.get('/courses/:education_level_id', { onRequest: [verifyJWT] }, getAnnouncementCourse)
  //Outros
  app.post('/profilePicture', { onRequest: [verifyJWT] }, uploadEntityProfilePicture)
  app.get('/profilePicture/:_id?', { onRequest: [verifyJWT] }, getEntityProfilePicture)
  app.get(
    '/applications/:announcement_id',
    { onRequest: [verifyJWT] },
    getApplications,
  )

  app.post('/announcement/csv/basic', { onRequest: [verifyJWT] }, uploadBasicEducationCSVFileToAnnouncement)
  app.post('/announcement/csv/higher', { onRequest: [verifyJWT] }, uploadHigherEducationCSVFileToAnnouncement)

}
