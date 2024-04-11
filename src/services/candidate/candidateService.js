import { api } from "../axios"

class EntityService {

    async updateProfile({ name, email, CEP, CPF, phone, socialReason, address, addressNumber, neighborhood, city, UF, }) {
        const token = localStorage.getItem("token")
        await api.patch('/candidates/basic-info', {
            name, email, CEP, address, addressNumber, neighborhood, city, UF, CPF, phone
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
}

export default new EntityService()