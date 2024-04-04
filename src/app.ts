require('module-alias/register');

import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { fastifyMultipart } from '@fastify/multipart';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyMulter from 'fastify-multer';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './env/index';
import { adminRoutes } from './http/controllers/admin/routes';
import { candidateRoutes } from './http/controllers/candidates/routes';
import { entityRoutes } from './http/controllers/entities/routes';
import { legalResponsibleRoutes } from './http/controllers/legal-responsible/routes';
import { assistantRoutes } from './http/controllers/social-assistant/routes';
import { authenticate } from './http/controllers/users/authenticate';
import { forgotPassword } from './http/controllers/users/forgot-password';
import { getUserProfilePicture } from './http/controllers/users/get-profile-picture';
import { logout } from './http/controllers/users/logout';
import { refresh } from './http/controllers/users/refresh';
import { resetPassword } from './http/controllers/users/reset-password';
import { uploadUserProfilePicture } from './http/controllers/users/upload-profile-picture';
import { verifyJWT } from './http/middlewares/verify-jwt';
import getUserAddress from './http/services/get-address';
import getCnpj from './http/services/get-cnpj';
import { multerConfig } from './lib/multer';
export const app = fastify()
app.register(fastifyMultipart, {
  limits: {
    fileSize: 15000000,
  },
})
// Registre o plugin fastify-cors
app.register(fastifyCors, {
  origin: ["https://dev-cadastraqui.vercel.app", "https://cadastraqui.vercel.app", "http://localhost:3000", "https://www.cadastraqui.com.br"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
export const upload = fastifyMulter(multerConfig)

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
app.register(adminRoutes, { prefix: '/admin' })
app.post('/session', authenticate)
app.post('/forgot_password', forgotPassword)
app.post('/reset_password', resetPassword)
app.post('/logout', logout)
app.patch('/refresh', refresh)
app.post(
  '/profilePicture',
  { onRequest: [verifyJWT] },
  uploadUserProfilePicture,
)
app.get('/profilePicture', { onRequest: [verifyJWT] }, getUserProfilePicture)
app.get('/getUserAddress', getUserAddress)
app.get('/getCompanyCnpj/:cnpj', getCnpj)
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
