import formatDate from "utils/format-date"
import { api } from "../axios"
import announcementMapper from "./mappers/announcementMapper"
import GENDER from "utils/enums/gender"
import findLabel from "utils/enums/helpers/findLabel"
import METADATA_FILE_TYPE from "utils/file/metadata-file-type"
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category"
import EDUCATION_STYLES from "utils/enums/education-style-types"
import { formatCPF } from "utils/format-cpf"
import moneyInputMask from "Components/MoneyFormInput/money-input-mask"
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type"
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer"
import { STUDENT_SCHOLARSHIP_TRANSLATION } from "utils/enums/student-scholarship-status"
import { STUDENT_RENEW_TRANSLATION } from "utils/enums/student-renew-status"

class EntityService {

    async updateProfile(data) {
        await api.patch('/entities/update-profile', data)
    }
    async getEntityInfo() {
        const response = await api.get("/entities/")
        return response.data.entity
    }
    async registerSubsidiary(data) {
        return api.post("/entities/subsidiary", data)
    }
    async registerResponsible(data) {
        return api.post("/entities/director", data)
    }
    async registerAssistant(data) {
        return api.post("/assistant/", data)
    }
    async uploadAnnouncementPDF(id, data) {
        return api.post(`/entities/upload/${id}`, data)
    }
    async createAnnouncement(data) {
        const mappedData = announcementMapper.toPersistence(data)
        const response = await api.post("/entities/announcement", mappedData)
        return response.data.announcement
    }
    async getFilteredAnnouncements({ filter } = { filter: null }) {
        const response = await api.get(`/entities/announcement/search${filter ? `?filter=${filter}` : ``}`)
        return response.data.announcements
    }
    async getAnnouncementById(id) {
        const response = await api.get(`/entities/announcement/${id}`)
        return response.data.announcement
    }
    async linkAssistantToAnnouncement(assistantId, announcementId) {
        return api.post(
            "/entities/announcement/assistant",
            {
                announcement_id: announcementId,
                assistant_id: assistantId,
            })
    }
    async removeAssistantFromAnnouncement(assistantId, announcementId) {
        return api.put(
            "/entities/announcement/assistant",
            {
                announcement_id: announcementId,
                assistant_id: assistantId,
            })
    }
    async getAvailableAssistants() {
        const response = await api.get(`/entities/announcement/assistant`)
        return response.data.socialAssistants
    }
    async updateAssistant(data) {
        return api.post(`/entities/assistant/update`, data)

    }
    async updateProfilePicture(data) {
        const response = await api.post("/entities/profilePicture", data)
        return response.data.url
    }
    async getDirectors() {
        const response = await api.get(`/entities/director/`)
        return response.data.directors
    }
    async deleteAssistant(id) {
        return api.delete(`/entities/assistant/${id}`)
    }
    async deleteDirector(id) {
        return api.delete(`/entities/director/${id}`)
    }
    async deleteSubsidiary(id) {
        return api.delete(`/entities/subsidiary/${id}`)
    }
    async updateSubsidiary(id, data) {
        return api.patch(`/entities/subsidiary/${id}`, data)
    }
    async updateDirector(id, data) {
        return api.patch(`/entities/director/${id}`, data)
    }
    async getDashboard() {
        const response = await api.get('/entities/dashboard')
        return response.data
    }
    async getAnnouncementCourse(courseId) {
        const response = await api.get(`/entities/courses/${courseId}`)
        return response.data.course
    }
    async uploadAnnouncementCsvBasic(data) {
        const response = await api.post('/entities/announcement/csv/basic', data)
        return response.data.csvDataFormated
    }
    async uploadAnnouncementCsvHigher(data) {
        const response = await api.post('/entities/announcement/csv/higher', data)
        return response.data.csvDataFormated
    }
    async getScholarshipsByCourse(id) {
        const response = await api.get(`/entities/courses/scholarships/${id}`)
        return response.data.scholarships
    }
    async getRegisteredByCourse(id) {
        const response = await api.get(`/entities/courses/registered/${id}`)
        return response.data.registered
    }
    updateScholarshipStatus(id, status) {
        return api.put(`/entities/scholarships/${id}`, { status })
    }
    enrollNewStudent(scholarshipid, {
        file, status, education_style
    }) {
        const formData = new FormData()
        formData.append("data", JSON.stringify({
            status,
            education_style,
        }))
        formData.append("file_metadatas", JSON.stringify({
            metadata_history: {
                type: METADATA_FILE_TYPE.STUDENT.HISTORY,
                category: METADATA_FILE_CATEGORY.Student
            }
        }))
        formData.append("file_history", file)
        return api.put(`/entities/scholarships/${scholarshipid}`, formData)
    }
    async getStudentsDashboard() {
        const response = await api.get(`/entities/students/dashboard`)
        return response.data
    }
    async getAllCourses() {
        const response = await api.get(`/entities/courses/all`)
        return response.data.courses
    }
    async getScholarshipApplicantDetails(scholarshipId) {
        const response = await api.get(`/entities/scholarships/details/${scholarshipId}`)
        const { scholarshipInfo, personalInfo } = response.data
        return {
            scholarshipInfo: { ...scholarshipInfo, isPartial: scholarshipInfo.isPartial ? 'Parcial' : 'Integral', semester: scholarshipInfo.semester === 0 ? null : scholarshipInfo.semester },
            personalInfo: { ...personalInfo, birthDate: formatDate(personalInfo?.birthDate), gender: findLabel(GENDER, personalInfo.gender) }
        }
    }
    async getScholarshipDocuments(scholarshipId) {
        const response = await api.get(`/entities/scholarships/documents/${scholarshipId}`)
        return response.data.documents
    }

}

export default new EntityService()