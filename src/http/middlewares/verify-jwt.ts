import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(req: FastifyRequest, reply: FastifyReply) {
  try {
    if (!req.headers.authorization) {
      return reply.status(401).send({ message: 'Unauthorized access.' })
    }

    await req.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized access.' })
  }
}
