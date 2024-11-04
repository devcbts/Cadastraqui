import { app } from './app'
import RemoveOutdatedExepenses from './cron/remove-outdated-expenses'
import RemoveOutdatedIncomes from './cron/remove-outdated-incomes'
import Selectjob from './cron/select-valid-candidates'
import sendStudentUpdateEmailJob from './cron/send-student-update-email'
import { env } from './env/index'
import analysisJob from './redis/queues/test'

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
    console.log(`HTTP Server Running on port ${env.PORT}!`)
  })
