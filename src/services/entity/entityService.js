import { api } from "../axios"
import announcementMapper from "./mappers/announcementMapper"

class EntityService {

    async updateProfile(data) {
        await api.patch('/entities/update-profile', data)
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
    async getFilteredAnnouncements({ filter } = { filter: null }) {
        const response = await api.get(`/entities/announcement/search${filter ? `?filter=${filter}` : ``}`)
        return response.data.announcements
    }
    async getAnnouncementById(id) {
        const response = await api.get(`/entities/announcement/${id}`)
        return response.data.announcement
    }
    async linkAssistantToAnnouncement(assistantId, announcementId) {
        return api.post(
            "/entities/announcement/assistant",
            {
                announcement_id: announcementId,
                assistant_id: assistantId,
            })
    }
    async removeAssistantFromAnnouncement(assistantId, announcementId) {
        return api.put(
            "/entities/announcement/assistant",
            {
                announcement_id: announcementId,
                assistant_id: assistantId,
            })
    }
    async getAvailableAssistants() {
        const response = await api.get(`/entities/announcement/assistant`)
        return response.data.socialAssistants
    }
    async updateAssistant(data) {
        return api.post(`/entities/assistant/update`, data)

    }
    async updateProfilePicture(data) {
        const response = await api.post("/entities/profilePicture", data)
        return response.data.url
    }
    async getDirectors() {
        const response = await api.get(`/entities/director/`)
        return response.data.directors
    }
    async deleteAssistant(id) {
        return api.delete(`/entities/assistant/${id}`)
    }
    async deleteDirector(id) {
        return api.delete(`/entities/director/${id}`)
    }
    async deleteSubsidiary(id) {
        return api.delete(`/entities/subsidiary/${id}`)
    }
    async updateSubsidiary(id, data) {
        return api.patch(`/entities/subsidiary/${id}`, data)
    }
    async updateDirector(id, data) {
        return api.patch(`/entities/director/${id}`, data)
    }
    async getDashboard() {
        const response = await api.get('/entities/dashboard')
        return response.data
    }
    async getAnnouncementCourse(courseId) {
        const response = await api.get(`/entities/courses/${courseId}`)
        return response.data.course
    }
    async uploadAnnouncementCsvBasic(data) {
        const response = await api.post('/entities/announcement/csv/basic', data)
        return response.data.csvDataFormated
    }
    async uploadAnnouncementCsvHigher(data) {
        const response = await api.post('/entities/announcement/csv/higher', data)
        return response.data.csvDataFormated
    }
    async getScholarshipsByCourse(id) {
        const response = await api.get(`/entities/courses/scholarships/${id}`)
        return response.data.scholarships
    }
    async getRegisteredByCourse(id) {
        const response = await api.get(`/entities/courses/registered/${id}`)
        return response.data.registered
    }
    updateScholarshipStatus(id, status) {
        return api.put(`/entities/scholarships/${id}`, { status })

    }
}

export default new EntityService()