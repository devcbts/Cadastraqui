import identityInfoMapper from "services/candidate/mappers/identity-info-mapper"
import { api } from "../axios"
import familyMemberMapper from "services/candidate/mappers/family-member-mapper"
import habitationMapper from "services/candidate/mappers/habitation-mapper"
import employementTypeMapper from "services/candidate/mappers/employement-type-mapper"
import vehicleMapper from "services/candidate/mappers/vehicle-mapper"
import basicInfoMapper from "./mappers/basic-info-mapper"
import expenseMapper from "services/candidate/mappers/expense-mapper"
import incomeMapper from "services/candidate/mappers/income-mapper"
import bankAccountMapper from "services/candidate/mappers/bank-account-mapper"
import healthInfoMapper from "services/candidate/mappers/health-info-mapper"
import removeObjectFileExtension from "utils/remove-file-ext"
import resumeMapper from "./mappers/resume-mapper"
import legalOpinionMapper from "./mappers/legal-opinion-mapper"

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
        return resumeMapper.fromPersistence(response.data)
    }
    async getLegalOpinion(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/parecer/${applicationId}`);
        return legalOpinionMapper.fromPersistence(response.data)
    }
    async getVehicleInfo(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/vehicle/${applicationId}`);
        return vehicleMapper.fromPersistence(response.data.vehicleInfoResults)

    }
    async getExpenses(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/expenses/${applicationId}`);
        return expenseMapper.fromPersistence(response.data)

    }
    async getAssistant() {
        const response = await api.get(`/assistant/basic-info`);
        return basicInfoMapper.fromPersistence(response.data)
    }
    async getMemberIncomeInfo(applicationId, memberId) {
        const response = await api.get(`/assistant/candidateInfo/monthly-income/${applicationId}/${memberId}`);
        const memberIncome = await this.getAllIncomes(applicationId)
        const monthlyIncome = incomeMapper.fromPersistence(response.data.incomeBySource)
        return { monthlyIncome, info: memberIncome.incomes?.find(e => e.id === memberId).months }
    }
    async getBankingAccountById(applicationId, id) {
        const response = await api.get(`/assistant/candidateInfo/bank-info/${applicationId}/${id}`)
        return bankAccountMapper.fromPersistence(response.data)
    }
    async getHealthInfo(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/health/${applicationId}`)
        return healthInfoMapper.fromPersistence(response.data.healthInfoResultsWithUrls)
    }
    async findCPFCNPJ(applicationId) {
        return api.get(`/assistant/candidateInfo/find-cpf-cnpj/${applicationId}`)
    }
    async uploadMajoracao(applicationId, data) {
        return api.post(`/assistant/documents/majoracao/${applicationId}`, data)
    }
    async uploadAdditionalInfo(applicationId, data) {
        return api.post(`/assistant/documents/aditional/${applicationId}`, data)
    }
    async updateApplication(applicationId, data) {
        return api.patch(`/assistant/application/${applicationId}`, data)
    }
    async getRegistrato(applicationId, id) {
        const response = await api.get(`/assistant/candidateInfo/registrato/${applicationId}/${id}`)
        const data = removeObjectFileExtension(response.data)
        const [date, url] = Object.entries(data)[0]
        const [month, year] = date.split('_')[1].split('-')
        const registrato_date = new Date(`${month}-01-${year}`)
        return { url, date: registrato_date }
    }
    async registerSolicitation(applicationId, solicitation) {
        const response = await api.post(`/assistant/solicitation/${applicationId}`, solicitation)
        return response.data.id
    }
    async deleteSolicitation(applicationId, id) {
        return api.delete(`/assistant/solicitation/${applicationId}/${id}`)
    }
    async getDeclarations(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/declaration/${applicationId}`)
        return response.data.declarations?.map(e => ({ ...e, urls: removeObjectFileExtension(e.url) }))
    }
    async sendLegalOpinionDocument(applicationId, data) {
        return api.post(`/assistant/post-pdf/${applicationId}`, data)
    }
    async enrollApplication(announcementId, applicationId) {
        return api.post(`/assistant/${announcementId}/${applicationId}`)
    }

    async getAnnouncementsScheduleSummary() {
        const response = await api.get('/assistant/schedule/summary')
        return response.data.announcements
    }
    async createSchedule(announcementId, values) {
        const response = await api.post(`/assistant/schedule/${announcementId}`, values)
        return response.data.id
    }
    async updateSchedule(announcementId, values) {
        const response = await api.patch(`/assistant/schedule/${announcementId}`, values)
        return response.data.id
    }
    async getAnnouncementSchedule(announcementId, scheduleId = '') {
        return api.get(`/assistant/schedule/${announcementId}/${scheduleId}`)
    }
    async updateInterview(scheduleId, data) {
        return api.patch(`/assistant/schedule/interview/${scheduleId}`, data)
    }
    async getSchedule() {
        return api.get(`/assistant/schedule`)
    }
    async rejectAppointment(scheduleId, data) {
        return api.post(`/assistant/schedule/not-accept/${scheduleId}`, data)
    }
    async getDashboard() {
        const response = await api.get(`/assistant/dashboard`)
        return response.data
    }
}

export default new SocialAssistantService()