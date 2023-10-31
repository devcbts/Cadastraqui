import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { env } from '@/env'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const refreshParamsSchema = z.object({
    refreshToken: z.string(),
  })
  const { refreshToken } = refreshParamsSchema.parse(request.query)

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET)
    const user_id = decoded.sub?.toString()

    const newToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user_id,
        },
      },
    )

    const newRefreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user_id,
          expiresIn: '7d',
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
        newRefreshToken,
      })
  } catch (err: any) {
    return reply.status(500).send({ err: err.message })
  }
}
