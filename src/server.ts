import { app } from './app'
import CheckExpiringEntityDocuments from './cron/check-expiring-entity-documents'
import RemoveOutdatedExepenses from './cron/remove-outdated-expenses'
import RemoveOutdatedIncomes from './cron/remove-outdated-incomes'
import Selectjob from './cron/select-valid-candidates'
import sendStudentUpdateEmailJob from './cron/send-student-update-email'
import { env } from './env/index'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    RemoveOutdatedIncomes
    RemoveOutdatedExepenses
    Selectjob
    sendStudentUpdateEmailJob
    CheckExpiringEntityDocuments
    console.log(`HTTP Server Running on port ${env.PORT}!`)
  })
