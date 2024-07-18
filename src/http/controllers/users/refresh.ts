import { env } from '@/env'
import { JwtPayload } from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const refreshParamsSchema = z.object({
    refreshToken: z.string(),
  })
  const { refreshToken } = refreshParamsSchema.parse(request.query)

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as JwtPayload
    const user_id = decoded.sub?.toString()
    const role = decoded.role;
    const uid = decoded.uid;
    const newToken = await reply.jwtSign(
      { role, uid },
      {
        sign: {
          sub: user_id,
        },
      },
    )

    const newRefreshToken = await reply.jwtSign(
      { role, uid },
      {
        sign: {
          sub: user_id,
          expiresIn: '1h',
        },
      },
    )

    return reply
      .setCookie('refreshToken', newRefreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        newToken,
        role,
        newRefreshToken,
      })
  } catch (err: any) {
    return reply.status(500).send({ err: err.message })
  }
}
