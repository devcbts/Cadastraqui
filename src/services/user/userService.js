import { api } from "../axios"

class UserService {
    async changePassword({ oldPass, newPass }) {
        const token = localStorage.getItem("token")
        return api.put('/change_password', {
            oldPassword: oldPass,
            newPassword: newPass
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
    async getProfilePicture({ role = null }) {
        const token = localStorage.getItem("token")
        if (role?.toLowerCase() === "entity") {
            const response = await api.get('/entities/profilePicture/', { headers: { Authorization: `Bearer ${token}` } })
            return response.data.url
        }
        const response = await api.get('/profilePicture', { headers: { Authorization: `Bearer ${token}` } })
        return response.data.url
    }
    async forgotPassword(email) {
        return api.post('/forgot_password', { email })
    }
    async uploadProfilePicture(data) {
        const response = await api.post('/profilePicture', data)
        return response.data.url
    }

}

const userServiceInstance = new UserService();
export default userServiceInstance;