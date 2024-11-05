const { api } = require("services/axios");

class AIService {
    async getReliabilityByApplication(applicationId) {
        const response = await api.get(`/assistant/assistant-ia/${applicationId}`)
        const { analysisStatus } = response.data
        return {
            analysisStatus
        }
    }
    async getApplicationAnalysis(applicationId) {
        const response = await api.get(`/assistant/assistant-ia/resume/${applicationId}`)
        const { candidate,
            responsible,
            familyMembers,
            familyGroupIncome,
            incomePerCapita,
            analysisStatus } = response.data
        return {
            candidate,
            responsible,
            familyMembers,
            familyGroupIncome,
            incomePerCapita,
            analysisStatus
        }
    }
}

export default new AIService()