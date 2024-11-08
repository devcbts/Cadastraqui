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


    async getAssistant() {
        const response = await api.get(`/assistant/basic-info`);
        return basicInfoMapper.fromPersistence(response.data)
    }
    async getLegalOpinion(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/parecer/${applicationId}`);
        return legalOpinionMapper.fromPersistence(response.data)
    }
    async getCandidateResume(applicationId) {
        const response = await api.get(`/assistant/candidateInfo/resume/${applicationId}`);
        return resumeMapper.fromPersistence(response.data)
    }
    // async findCPFCNPJ(applicationId) {
    //     return api.get(`/assistant/candidateInfo/find-cpf-cnpj/${applicationId}`)
    // }
    async uploadMajoracao(applicationId, data) {
        return api.post(`/assistant/documents/majoracao/${applicationId}`, data)
    }
    async uploadAdditionalInfo(applicationId, data) {
        return api.post(`/assistant/documents/aditional/${applicationId}`, data)
    }
    async updateApplication(applicationId, data) {
        return api.patch(`/assistant/application/${applicationId}`, data)
    }

    async registerSolicitation(applicationId, solicitation) {
        const response = await api.post(`/assistant/solicitation/${applicationId}`, solicitation)
        return response.data.id
    }
    async deleteSolicitation(applicationId, id) {
        return api.delete(`/assistant/solicitation/${applicationId}/${id}`)
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
    async getGrantedScholarshipsByCourse(courseId) {
        const response = await api.get(`/assistant/administrative/scholarships/${courseId}`)
        return response.data.scholarships
    }
    async getTypeTwoBenefitsByScholarship(scholarshipId) {
        const response = await api.get(`/assistant/administrative/type2/${scholarshipId}`)
        return { typeTwoInfotmation: response.data.type2Benefits, family: response.data.formatedMembers }
    }
    async getTypeOneBenefitsByCourse(courseId) {
        const response = await api.get(`/assistant/administrative/type1/${courseId}`)
        return { typeOneInformation: response.data.type1Benefits }
    }
    updateScholarshipGranted(scholarshipId, data) {
        return api.post(`/assistant/administrative/scholarships/${scholarshipId}`, data)
    }
    updateTypeTwoBenefits(scholarshipId, data) {
        return api.post(`/assistant/administrative/type2/${scholarshipId}`, data)
    }
    updateTypeOneBenefits(educationLevelId, data) {
        return api.post(`/assistant/administrative/type1/${educationLevelId}`, data)
    }
    async getAdminCourseInfo(courseId) {
        const response = await api.get(`/assistant/administrative/general/course/${courseId}`)
        return response.data
    }
    async getPartialReport(announcementId, entityId, format = "CSV", { filename = "relatorio" }) {
        const config = format === "CSV" ? { responseType: "blob", filename: filename } : {}
        const response = await api.get(`/assistant/administrative/report/partial/${announcementId}/${entityId}?format=${format}`, config)
        return response.data
    }
    async getFullReport(announcementId, format = "CSV", { filename = "relatorio" }) {
        const config = format === "CSV" ? { responseType: "blob", filename: filename } : {}
        const response = await api.get(`/assistant/administrative/report/full/${announcementId}?format=${format}`, config)
        return response.data
    }
    async getNominalReport(announcementId, entityId, format = "CSV", { filename = "relatorio" }) {
        const config = format === "CSV" ? { responseType: "blob", filename: filename } : {}
        const response = await api.get(`/assistant/administrative/report/nominal/${announcementId}/${entityId}?format=${format}`, config)
        return response.data
    }

}

export default new SocialAssistantService()