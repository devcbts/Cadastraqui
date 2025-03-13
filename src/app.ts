// require('module-alias/register');
import compress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import { fastifyMultipart } from '@fastify/multipart';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyMulter from 'fastify-multer';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './env/index';
import { adminRoutes } from './http/controllers/admin/routes';
import { applicationRoutes } from './http/controllers/application/routes';
import { candidateRoutes } from './http/controllers/candidates/routes';
import { entityRoutes } from './http/controllers/entities/routes';
import { legalResponsibleRoutes } from './http/controllers/legal-responsible/routes';
import { signatureRoutes } from './http/controllers/signature/routes';
import { assistantRoutes } from './http/controllers/social-assistant/routes';
import studentsRoutes from './http/controllers/students/routes';
import subscriptionRoutes from './http/controllers/subscriptions/routes';
import { authenticate } from './http/controllers/users/authenticate';
import changePassword from './http/controllers/users/change_password';
import { forgotPassword } from './http/controllers/users/forgot-password';
import { getUserProfilePicture } from './http/controllers/users/get-profile-picture';
import { logout } from './http/controllers/users/logout';
import { refresh } from './http/controllers/users/refresh';
import { resetPassword } from './http/controllers/users/reset-password';
import { userRoutes } from './http/controllers/users/routes';
import { uploadUserProfilePicture } from './http/controllers/users/upload-profile-picture';
import verifyPasswordRecoveryToken from './http/controllers/users/verify-password-recovery-token';
import { verifyJWT } from './http/middlewares/verify-jwt';
import getUserAddress from './http/services/get-address';
import getCnpj from './http/services/get-cnpj';
import { multerConfig } from './lib/multer';
import './lib/pg-listener';
import { prisma } from './lib/prisma';
export const app = fastify({
  trustProxy: true
})
app.register(fastifyMultipart,
  {
    // attachFieldsToBody: true
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
  })
app.register(helmet, {
  global: true,
  xFrameOptions: { action: 'deny' },
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});
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

app.addHook('preHandler', async (req, _) => {
  // get current user_id for audit logs

  await prisma.$queryRawUnsafe(`SET req.userId = '${req.user?.sub ?? 'NOTDEFINED'}'`)

})

app.register(compress, { global: true })
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '3h',
  },
})

app.register(fastifyCookie)
app.register(candidateRoutes, { prefix: '/candidates' })
app.register(legalResponsibleRoutes, { prefix: '/responsibles' })
app.register(entityRoutes, { prefix: '/entities' })
app.register(assistantRoutes, { prefix: '/assistant' })
app.register(adminRoutes, { prefix: '/admin' })
app.register(signatureRoutes, { prefix: '/sign' })
app.register(userRoutes, { prefix: '/user' })
app.register(applicationRoutes, { prefix: '/application' })
app.register(subscriptionRoutes, { prefix: '/subscription' })
app.register(studentsRoutes, { prefix: '/students' })
app.post('/session', authenticate)
app.post('/forgot_password', forgotPassword)
app.post('/reset_password', resetPassword)
app.post('/logout', logout)

app.patch('/refresh', refresh)
app.put('/change_password', { onRequest: [verifyJWT] }, changePassword)
app.post(
  '/profilePicture',
  { onRequest: [verifyJWT] },
  uploadUserProfilePicture,
)
app.get(
  '/verify-password-token',
  verifyPasswordRecoveryToken,
)
app.get('/profilePicture', { onRequest: [verifyJWT] }, getUserProfilePicture)
app.get('/getUserAddress', getUserAddress)
app.get('/getCompanyCnpj/:cnpj', getCnpj)
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {

    return reply
      .status(400)
      .send({ message: 'Erro código 400 - Bad request' })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // To-do:
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
