import { api } from "../axios"

class SocialAssistantService {

    async updateProfile({ name, email, CRESS, CPF, phone }) {
        const token = localStorage.getItem("token")
        await api.patch('/assistant/update-profile', {
            name, email, CPF, CRESS, phone
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
}

export default new SocialAssistantService()