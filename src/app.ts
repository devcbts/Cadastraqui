import { env } from './env/index'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { candidateRoutes } from './http/controllers/candidates/routes'
import { legalResponsibleRoutes } from './http/controllers/legal-responsible/routes'
import { entityRoutes } from './http/controllers/entities/routes'
import { authenticate } from './http/controllers/users/authenticate'

export const app = fastify()

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
app.post('/session', authenticate)

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
