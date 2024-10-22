import '@fastify/jwt'
import { ROLE } from '@prisma/client'
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: keyof typeof ROLE
    }
  }
  export interface JwtPayload {
    sub: string,
    uid: string,
    role: string,
    iat: number,
    exp: number
  }
}
