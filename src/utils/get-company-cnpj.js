import { api } from "../services/axios";

export default async function getCompanyCNPJ(cnpj) {
    try {

        const { data } = await api.get(
            `/getCompanyCnpj/${cnpj}`)
        return data;
    } catch (err) {
        return
    }

}