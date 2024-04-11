import { api } from "../axios"

class LegalResponsible {

    async updateProfile({ name, email, CEP, CPF, phone, socialReason, address, addressNumber, neighborhood, city, UF, }) {
        const token = localStorage.getItem("token")
        await api.patch('/responsibles/update-profile', {
            name, email, CEP, address, addressNumber, neighborhood, city, UF, CPF, phone
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
}

export default new LegalResponsible()