import { NotAllowedError } from '@/errors/not-allowed-error'
import { ROLE } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyRole(roleToVerirfy: ROLE) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { role } = req.user

      if (role !== roleToVerirfy) {
        throw new NotAllowedError()
      }
    } catch (err) {
      return reply.status(401).send({ message: 'Unauthorized access.' })
    }
  }
}
