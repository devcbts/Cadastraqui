import { api } from "../axios"

class SocialAssistantService {

    async updateProfile({ name, email, CRESS, CPF, phone }) {
        const token = localStorage.getItem("token")
        await api.patch('/assistant/update-profile', {
            name, email, CPF, CRESS, phone
        }, { headers: { Authorization: `Bearer ${token}` } })
    }

    async getAllAnnouncements() {
        const response = await api.get('/assistant/announcement')
        return response.data.announcements
    }

    async getAnnouncementById(id) {
        const response = await api.get(`/assistant/announcement/${id}`)
        // {announcement: {...}, educationLevels: [...]}
        return response.data
    }

    async getApplication(id) {
        const response = await api.get(`/assistant/applications/${id}`)
        return response.data
    }

}

export default new SocialAssistantService()