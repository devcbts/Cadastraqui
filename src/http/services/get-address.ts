import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getUserAddress(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const { cep } = request.query as { cep: string }
    const numberRegexp = /\d/g
    console.log(request.query)
    if (numberRegexp.test(cep)) {
        const userAddress = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        console.log(userAddress)
        return reply.status(200).send(userAddress.data)
    }
    return reply.status(400).send('CEP inválido')
}