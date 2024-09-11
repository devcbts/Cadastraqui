import { APIError } from '@/errors/api-error'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { lookup } from 'geoip-lite'
import { UAParser } from 'ua-parser-js'
import { z } from 'zod'
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: { Candidate: true, LegalResponsible: true, SocialAssistant: true }
    })

    if (!user) {
      throw new InvalidCredentialsError()
    }
    if (!user.isActive) {
      throw new APIError('Esta conta está inativada')
    }
    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }
    const uid = user.Candidate?.id ?? user.LegalResponsible?.id ?? user.SocialAssistant?.id
    const token = await reply.jwtSign(
      {
        role: user.role,
        uid
      },
      {
        sign: { sub: user.id },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
        uid,
      },
      {
        sign: { sub: user.id, expiresIn: '3h' },
      },
    )
    const ip = request.socket.remoteAddress
    const location = lookup(ip ?? '')
    const parser = new UAParser(request.headers['user-agent'])
    const result = parser.getResult()
    const device = result.device

    // creates an instance on LoginHistory to keep track of user's access on the Application
    await prisma.loginHistory.create({
      data: {
        user_id: user.id,
        ip: ip,
        city: location?.city,
        country: location?.country,
        deviceModel: device.model,
        deviceType: device.type,
        browser: result.browser.name
      }
    })
    const user_role = user.role
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token, user_role, refreshToken })
  } catch (err: any) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
