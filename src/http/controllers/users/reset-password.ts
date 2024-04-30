import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'

export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
  const resetPasswordBodySchema = z.object({
    password: z.string(),
  })

  const resetPasswordQuerySchema = z.object({
    token: z.string(),
  })

  const { password } = resetPasswordBodySchema.parse(req.body)
  const { token } = resetPasswordQuerySchema.parse(req.query)

  try {
    if (!token) {
      throw new ResourceNotFoundError()
    }



    const decodedToken = jwt.decode(token) as JwtPayload

    const user = await prisma.user.findUnique({ where: { id: decodedToken?.token } })

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const new_password_hash = await hash(password, 6)

    await prisma.user.update({
      where: { id: decodedToken?.token },
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
