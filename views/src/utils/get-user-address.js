import { api } from "../services/axios";

export default async function getUserAddress(cep) {
    const userAddress = await api.get('/getUserAddress', {
        params: { cep }
    })
    const { data } = userAddress
    return data
}