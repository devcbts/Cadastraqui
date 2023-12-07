import { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    // Opcional: Você pode adicionar lógica adicional aqui para invalidar o token
    // de atualização no banco de dados, se estiver armazenando-os.

    // Limpa o cookie contendo o token de atualização.
    return reply
      .clearCookie('refreshToken', {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ message: 'Logout successful' })
  } catch (err: any) {
    return reply.status(500).send({ message: 'Logout failed' })
  }
}
