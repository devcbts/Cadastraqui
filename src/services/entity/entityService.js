import { api } from "../axios"
import announcementMapper from "./mappers/announcementMapper"

class EntityService {

    async updateProfile({ name, email, CEP, CNPJ, socialReason, address, addressNumber, neighborhood, city, UF, }) {
        const token = localStorage.getItem("token")
        await api.patch('/entities/update-profile', {
            name, email, CEP, address, addressNumber, neighborhood, city, UF, CNPJ, socialReason
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
    async getEntityInfo() {
        const response = await api.get("/entities/")
        return response.data.entity
    }
    async registerSubsidiary(data) {
        return api.post("/entities/subsidiary", data)
    }
    async registerResponsible(data) {
        return api.post("/entities/director", data)
    }
    async registerAssistant(data) {
        return api.post("/assistant/", data)
    }
    async uploadAnnouncementPDF(id, data) {
        return api.post(`/entities/upload/${id}`, data)
    }
    async createAnnouncement(data) {
        const mappedData = announcementMapper.toPersistence(data)
        const response = await api.post("/entities/announcement", mappedData)
        return response.data.announcement
    }
}

export default new EntityService()