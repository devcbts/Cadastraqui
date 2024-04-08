import { api } from "../axios"

class UserService {
    async changePassword({ oldPass, newPass }) {
        await api.put('/change_password', {
            oldPassword: oldPass,
            newPassword: newPass
        })
    }
}

export default new UserService()