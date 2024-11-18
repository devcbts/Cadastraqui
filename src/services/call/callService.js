import { api } from "services/axios"
import objectToFormData from "utils/object-to-form-data"

class CallService {
    createCall({
        name, message, subject, file
    }) {
        const formData = new FormData()
        formData.append("data", JSON.stringify({ socialName: name, message, callSubject: subject }))
        formData.append("file", file)
        return api.post('/user/call', formData)
    }
    async getOpenCalls({ page, size } = {}) {
        const response = await api.get('/user/call/unsolved', { params: { page, size } })
        const { calls, total } = response.data
        return { calls, total }
    }
    async getUserCalls({ page, size } = {}) {
        const response = await api.get('/user/call', { params: { page, size } })
        const { calls, total } = response.data
        return {
            calls, total
        }
    }
    async getCallById(id) {
        const response = await api.get(`/user/call/${id}`)
        return response.data.call
    }
    async sendMessage({ id, message }) {
        const response = await api.post(`/user/call/${id}`, { message })
        return response.data.callMessage
    }
    linkCall({ id }) {
        return api.put(`/user/call/link`, { id })
    }
    finishCall({ id }) {
        return api.put(`/user/call/finish`, { id })
    }
}

export default new CallService()