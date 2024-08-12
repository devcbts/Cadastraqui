import { UserNotExistsError } from '@/errors/users-not-exists-error'
import { sendPasswordRecoveryMail } from '@/http/services/send-pass-recovery-email'
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

    const token = await reply.jwtSign({ token: user.id }, { sign: { expiresIn: '3h' } })
    const { messageId } = await sendPasswordRecoveryMail({ token, email })
    if (messageId) {
      return reply.status(204).send()
    } else {
      return reply.status(404).send()
    }
  } catch (err) {
    if (err instanceof UserNotExistsError) {
      return reply.status(404).send({ message: 'Usuário não encontrado. Certifique-se de que o email digitado está correto.' })
    }
  }
}
