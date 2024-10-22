import { api } from "services/axios"

class SubscriptionService {
    async getCandidateSubscriptionDocuments(candidateId) {
        const response = await api.get(`/subscription/documents/${candidateId}`)
        return response.data.documents
    }
}

export default new SubscriptionService()