import identityInfoMapper from "services/candidate/mappers/identity-info-mapper"
import { api } from "../axios"
import familyMemberMapper from "services/candidate/mappers/family-member-mapper"
import habitationMapper from "services/candidate/mappers/habitation-mapper"
import employementTypeMapper from "services/candidate/mappers/employement-type-mapper"
import vehicleMapper from "services/candidate/mappers/vehicle-mapper"
import basicInfoMapper from "./mappers/basic-info-mapper"

class SocialAssistantService {

    async updateProfile(data) {
        const token = localStorage.getItem("token")
        await api.patch('/assistant/update-profile', data, { headers: { Authorization: `Bearer ${token}` } })
    }

    async getAllAnnouncements(filter) {
        const response = await api.get(`/assistant/announcement?filter=${filter}`)
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

    async getCandidateIdentityInfo(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/identity/${applicationId}`);
        return identityInfoMapper.fromPersistence({ ...response.data, urls: response.data.urls })
    }
    async getCandidateFamilyGroup(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/family/${applicationId}`);
        return response.data.familyMembers?.map(e => familyMemberMapper.fromPersistence(e))

    }
    async getHousingInfo(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/housing/${applicationId}`);
        return habitationMapper.fromPersistence(response.data)
    }
    async getAllIncomes(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/income/${applicationId}`);
        return employementTypeMapper.fromPersistence(response.data)
    }
    async getCandidateResume(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/resume/${applicationId}`);
        return response.data
    }
    async getLegalOpinion(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/parecer/${applicationId}`);
        return response.data
    }
    async getVehicleInfo(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/vehicle/${applicationId}`);
        return vehicleMapper.fromPersistence(response.data)

    }
    async getAssistant() {
        const response = await api.get(`/assistant/basic-info`);
        return basicInfoMapper.fromPersistence(response.data)
    }

}

export default new SocialAssistantService()