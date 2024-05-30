import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'CANDIDATE' | 'RESPONSIBLE' | 'ASSISTANT' | 'ENTITY'
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
