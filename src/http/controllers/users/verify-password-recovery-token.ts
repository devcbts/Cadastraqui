import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from 'jsonwebtoken';
import z from 'zod';


export default function verifyPasswordRecoveryToken(
    request: FastifyRequest,
    response: FastifyReply
) {
    const verifyPasswordTokenSchema = z.object({
        token: z.string()
    })

    const parsedToken = verifyPasswordTokenSchema.parse(request.query)
    try {

        jwt.verify(parsedToken.token, process.env.JWT_SECRET!, { ignoreExpiration: false }) as JwtPayload
        return response.status(200).send()
    } catch (err: any) {
        return response.status(400).send({ message: err.message })
    }


}