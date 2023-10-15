import { NotAllowedError } from '@/errors/not-allowed-error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userType = req.user.role

    if (userType !== 'ADMIN') {
      throw new NotAllowedError()
    }
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized access.' })
  }
}
