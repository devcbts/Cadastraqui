import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getUserAddress(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    let { cep } = request.query as { cep: string }
    const numberRegexp = /\d/g

    try {
        cep.replace(/\D/, '')
        if (numberRegexp.test(cep)) {
            const userAddress = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            const { logradouro, bairro, uf, localidade } = userAddress.data as { logradouro: string, bairro: string, uf: string, localidade: string }
            return reply.status(200).send({
                city: localidade,
                neighborhood: bairro,
                address: logradouro,
                UF: uf
            })
        }
        return reply.status(400).send('CEP inválido')
    } catch (err) {
        return reply.status(500).send('Ocorreu um erro')
    }

}