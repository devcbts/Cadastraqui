import { api } from "services/axios"

class AdminService {
    async registerEntity(data) {
        const response = await api.post('/entities/', data)
        return response.data.entity
    }
}

export default new AdminService()