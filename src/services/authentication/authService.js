const { api } = require("services/axios");

class AuthService {
    async login({ email, password }) {
        const response = await api.post('/session', { email, password })
        return response.data
    }
}

export default new AuthService()