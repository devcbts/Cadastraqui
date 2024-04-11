import { api } from "../axios"

class UserService {
    async changePassword({ oldPass, newPass }) {
        const token = localStorage.getItem("token")

        await api.put('/change_password', {
            oldPassword: oldPass,
            newPassword: newPass
        }, { headers: { Authorization: `Bearer ${token}` } })
    }


}

export default new UserService()