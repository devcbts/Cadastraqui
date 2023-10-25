import { env } from './env/index'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { candidateRoutes } from './http/controllers/candidates/routes'
import { legalResponsibleRoutes } from './http/controllers/legal-responsible/routes'
import { entityRoutes } from './http/controllers/entities/routes'
import { authenticate } from './http/controllers/users/authenticate'
import { refresh } from './http/controllers/users/refresh'
import { forgotPassword } from './http/controllers/users/forgot-password'
import { resetPassword } from './http/controllers/users/reset-password'
import morgan from 'morgan'
import fastifyMulter from 'fastify-multer'
import { multerConfig } from './lib/multer'
import { uploadFile } from './http/services/upload-file'
import { assistantRoutes } from './http/controllers/social-assistant/routes'

export const app = fastify()

export const upload = fastifyMulter(multerConfig)
app.register(fastifyMulter.contentParser)

app.addHook('onRequest', (request, reply, done) => {
  morgan('dev')(request.raw, reply.raw, done)
})

app.post(
  '/upload',
  { preHandler: upload.single('file') },
  async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send()
  },
)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(candidateRoutes, { prefix: '/candidates' })
app.register(legalResponsibleRoutes, { prefix: '/responsibles' })
app.register(entityRoutes, { prefix: '/entities' })
app.register(assistantRoutes, { prefix: '/assistant' })

app.post('/session', authenticate)
app.post('/forgot_password', forgotPassword)
app.post('/reset_password', resetPassword)
app.patch('/token/refresh', refresh)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error:', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // To-do:
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
