import { api } from "../axios"

class EntityService {

    async updateProfile({ name, email, CEP, CNPJ, socialReason, address, addressNumber, neighborhood, city, UF, }) {
        const token = localStorage.getItem("token")
        await api.patch('/entities/update-profile', {
            name, email, CEP, address, addressNumber, neighborhood, city, UF, CNPJ, socialReason
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
    async registerSubsidiary(data) {
        return api.post("/entities/subsidiary", data)
    }
}

export default new EntityService()