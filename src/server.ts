import { app } from './app'
import job from './cron/remove-outdated-incomes'
import { env } from './env/index'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    job
    console.log(`HTTP Server Running on port ${env.PORT}!`)
  })
