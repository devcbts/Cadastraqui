import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";

export default async function getCnpj(
    request: FastifyRequest,
    response: FastifyReply
) {
    const { cnpj } = request.params as { cnpj: string }
    const onlyDigits = cnpj.replace(/\D/g, '')
    const isValidCNPJ = onlyDigits.length === 14
    if (!isValidCNPJ) {
        return response.status(400).send('CNPJ inválido')
    }
    try {
        const api = await axios.get(`https://api.cnpja.com/office/${cnpj}`, {
            headers: { 'Authorization': process.env.CNPJ_API }
        })
        const { data } = api
        //return just the data we need to effectively use
        const {
            company: { name },
            status,
            address,
            phones,
            emails,
        } = data
        if (!data) {
            return response.status(400).send()
        }
        return response.status(200).send({
            name, phones, emails, address,
            active: status.id === 2,
        })
    } catch (err: any) {

        return response.status(500).send(err.message)
    }

}