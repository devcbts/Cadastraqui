import { api } from "services/axios"

class AdminService {
    async registerEntity(data) {
        const response = await api.post('/entities/', data)
        return response.data.entity
    }
    async getEntities() {
        const response = await api.get('/admin/entidades/')
        return response.data.entities
    }
    async getEntityById(id) {
        const response = await api.get(`/admin/entidades/${id}`)
        return response.data.entity
    }
}

export default new AdminService()