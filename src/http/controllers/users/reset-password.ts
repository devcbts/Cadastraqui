import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
  const resetPasswordBodySchema = z.object({
    new_password: z.string(),
  })

  const resetPasswordQuerySchema = z.object({
    token: z.string(),
  })

  const { new_password } = resetPasswordBodySchema.parse(req.body)
  const { token } = resetPasswordQuerySchema.parse(req.query)

  try {
    if (!token) {
      throw new ResourceNotFoundError()
    }

    await req.jwtVerify()

    const userId = req.user.sub

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const new_password_hash = await hash(new_password, 6)

    await prisma.user.update({
      where: { id: userId },
      data: { password: new_password_hash },
    })
    console.log(new_password_hash, user.password)

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send()
    }
  }
}
