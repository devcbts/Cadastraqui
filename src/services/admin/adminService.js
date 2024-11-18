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
    async getAccountInformation(id) {
        const response = await api.get(`/admin/accounts/${id}`)
        return response.data.account
    }
    async getAccountHistory(id, filter = "login") {
        // filter must be one of sac, login
        const response = await api.get(`/admin/accounts/history/${id}?filter=${filter}`)
        return response.data.history
    }
    async getAccounts({ filter, search, type, page, size } = {}) {
        //filter must be one of common, entities
        const response = await api.get(`/admin/accounts`, {
            params: {
                filter, search, type, page, size
            }
        })
        const { accounts, total } = response.data
        return {
            accounts,
            total
        }
    }
    async changeAccountActiveStatus(id) {
        await api.put(`/admin/accounts/active/${id}`)
    }
}

export default new AdminService()