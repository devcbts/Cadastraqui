import { UserNotExistsError } from '@/errors/users-not-exists-error'
import { sendMail } from '@/http/services/send-mail'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function forgotPassword(req: FastifyRequest, reply: FastifyReply) {
  const forgotPasswordBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = forgotPasswordBodySchema.parse(req.body)
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new UserNotExistsError()
    }

    const token = await reply.jwtSign({
      sign: { sub: user.id },
    })

    const { messageId } = await sendMail(token)

    if (messageId) {
      return reply.status(204).send()
    } else {
      return reply.status(404).send()
    }
  } catch (err) {
    if (err instanceof UserNotExistsError) {
      return reply.status(404).send()
    }
  }
}
