import { api } from "../axios"

class UserService {
    async changePassword({ oldPass, newPass }) {
        const token = localStorage.getItem("token")
        return api.put('/change_password', {
            oldPassword: oldPass,
            newPassword: newPass
        }, { headers: { Authorization: `Bearer ${token}` } })
    }
    async getProfilePicture() {
        const token = localStorage.getItem("token")
        const response = await api.get('/profilePicture', { headers: { Authorization: `Bearer ${token}` } })
        return response.data.url
    }
    async forgotPassword(email) {
        return api.post('/forgot_password', { email })
    }

}

export default new UserService()