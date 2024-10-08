import { app } from './app'
import { env } from './env/index'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    // RemoveOutdatedIncomes
    // RemoveOutdatedExepenses
    // Selectjob
    console.log(`HTTP Server Running on port ${env.PORT}!`)
  })
